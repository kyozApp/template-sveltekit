import { error } from "@sveltejs/kit";
import { command } from "$app/server";

import { assertAdminOrSuperAdmin } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import {
	userDeleteSchema,
	userToggleStatusSchema,
} from "#lib/validations/user/user.command.validation.ts";

import { getUserDetails, getUserList } from "./user.query.remote.ts";

/**
 * Cambia el estado de activación de un usuario (isActive).
 */
export const toggleUserStatus = command(
	userToggleStatusSchema.body,
	async (data) => {
		// 1. Validar permisos de administrador
		const actor = assertAdminOrSuperAdmin();

		// 2. Prohibir auto-desactivación
		if (actor.user.id === data.id) {
			error(400, "No puedes desactivar tu propia cuenta en sesión.");
		}

		// 3. Validar existencia del usuario
		const existing = await db.orm.public.User.where({ id: data.id }).first();
		if (!existing) {
			error(404, "El usuario no se encontró.");
		}

		// 4. Blindaje total del SUPERADMIN (cuenta de respaldo / break-glass)
		if (existing.role === "SUPERADMIN") {
			error(
				403,
				"No tienes autorización para suspender o activar esta cuenta.",
			);
		}

		// 5. Determinar nuevo estado e invalidar sesiones si se desactiva
		const newIsActive = !existing.isActive;

		if (!newIsActive) {
			await db.orm.public.Session.where({ userId: data.id }).deleteAll();
		}

		// 6. Actualizar estado del usuario en la base de datos
		await db.orm.public.User.where({ id: data.id }).update({
			isActive: newIsActive,
		});

		// 7. Invalidar caché y refrescar datos
		void getUserList().refresh();
		void getUserDetails({ id: data.id }).refresh();
	},
);

/**
 * Elimina lógicamente a un usuario del sistema (Soft Delete).
 */
export const deleteUser = command(userDeleteSchema.body, async (data) => {
	// 1. Validar permisos de Administrador o superior
	const actor = assertAdminOrSuperAdmin();

	// 2. Prohibir auto-eliminación
	if (actor.user.id === data.id) {
		error(400, "No puedes eliminar tu propia cuenta en sesión.");
	}

	// 3. Validar existencia del usuario
	const existing = await db.orm.public.User.where({ id: data.id }).first();
	if (!existing) {
		error(404, "El usuario no se encontró.");
	}

	// 4. Blindaje total del SUPERADMIN (cuenta de respaldo / break-glass)
	if (existing.role === "SUPERADMIN") {
		error(403, "No tienes autorización para dar de baja esta cuenta.");
	}

	// 5. Revocar todas las sesiones del usuario a eliminar
	await db.orm.public.Session.where({ userId: data.id }).deleteAll();

	// 6. Aplicar baja lógica (Soft Delete)
	await db.orm.public.User.where({ id: data.id }).update({
		isDeleted: true,
		deletedAt: new Date().toISOString(),
		isActive: false,
		email: `${existing.email}.deleted.${existing.id}`,
		username: `${existing.username}.deleted.${existing.id}`,
	});

	// 7. Invalidar caché y refrescar listados
	void getUserList().refresh();
	void getUserDetails({ id: data.id }).refresh();
});
