import { form } from "$app/server";

import argon2 from "argon2";

import { assertAdminOrSuperAdmin } from "#lib/server/auth";
import { db } from "#lib/server/db";
import {
	userCreateSchema,
	userUpdateSchema,
} from "#lib/validations/user/user.form.validation";

import { getUserDetails, getUserList } from "./user.query.remote";

/**
 * Registra un nuevo usuario en el sistema.
 */
export const createUser = form(userCreateSchema.body, async (data) => {
	// 1. Validar permisos de administrador
	assertAdminOrSuperAdmin();

	// 2. Blindaje total: nadie puede crear cuentas con rol SUPERADMIN desde la interfaz
	if ((data.role as string) === "SUPERADMIN") {
		return {
			success: false,
			error: "Selecciona un rol válido de la lista.",
		};
	}

	// 3. Validar disponibilidad de nombre de usuario y correo
	const existingUsername = await db.orm.public.User.first({
		username: data.username,
	});
	if (existingUsername) {
		return {
			success: false,
			error: "El nombre de usuario ya está registrado.",
		};
	}

	const existingEmail = await db.orm.public.User.first({ email: data.email });
	if (existingEmail) {
		return {
			success: false,
			error: "El correo electrónico ya está registrado.",
		};
	}

	// 4. Hashear la contraseña con Argon2
	const hashedPassword = await argon2.hash(data.password);

	// 5. Insertar nuevo usuario en la base de datos
	await db.orm.public.User.create({
		name: data.name,
		username: data.username,
		email: data.email,
		password: hashedPassword,
		role: data.role as "ADMIN" | "USER" | "VIEWER",
		isActive: data.isActive,
		isDeleted: false,
	});

	// 6. Invalidar caché y refrescar el listado
	void getUserList().refresh();
});

/**
 * Actualiza los datos de un usuario existente.
 */
export const updateUser = form(userUpdateSchema.body, async (data) => {
	// 1. Validar permisos de administrador
	const actor = assertAdminOrSuperAdmin();

	// 2. Validar existencia del usuario
	const existing = await db.orm.public.User.where({ id: data.id }).first();
	if (!existing) {
		return {
			success: false,
			error: "El usuario no se encontró.",
		};
	}

	// 3. Reglas de blindaje del SUPERADMIN (break-glass):
	// A. Si el objetivo es SUPERADMIN, solo el mismo SUPERADMIN puede editarse
	//    y nunca puede cambiar su rol ni desactivarse
	if (existing.role === "SUPERADMIN") {
		if (actor.user.role !== "SUPERADMIN") {
			return {
				success: false,
				error: "El usuario no se encontró o no puede ser modificado.",
			};
		}
		data.role = "SUPERADMIN";
		data.isActive = true;
	} else if ((data.role as string) === "SUPERADMIN") {
		// B. Nadie puede ascender a nadie al rol SUPERADMIN desde la interfaz
		return {
			success: false,
			error: "Selecciona un rol válido de la lista.",
		};
	}

	// 4. Reglas de auto-edición:
	// A. Nadie puede alterar su propio rol
	if (actor.user.id === data.id) {
		data.role = existing.role;
	}

	// B. Nadie puede desactivar su propia cuenta en sesión
	if (actor.user.id === data.id && data.isActive === false) {
		return {
			success: false,
			error: "No puedes desactivar tu propia cuenta en sesión.",
		};
	}

	// 5. Validar duplicidad de nombre de usuario y correo
	if (data.username && data.username !== existing.username) {
		const usernameTaken = await db.orm.public.User.first({
			username: data.username,
		});
		if (usernameTaken) {
			return {
				success: false,
				error: "El nombre de usuario ya está registrado.",
			};
		}
	}

	if (data.email && data.email !== existing.email) {
		const emailTaken = await db.orm.public.User.first({ email: data.email });
		if (emailTaken) {
			return {
				success: false,
				error: "El correo electrónico ya está registrado.",
			};
		}
	}

	// 6. Hashear la nueva contraseña si fue provista
	let hashedPassword: string | undefined;
	if (data.password) {
		hashedPassword = await argon2.hash(data.password);
	}

	// 7. Revocar sesiones activas si el usuario es desactivado
	if (data.isActive === false) {
		await db.orm.public.Session.where({ userId: data.id }).delete();
	}

	// 8. Actualizar usuario en la base de datos
	await db.orm.public.User.where({ id: data.id }).update({
		name: data.name,
		username: data.username,
		email: data.email,
		...(hashedPassword ? { password: hashedPassword } : {}),
		role: data.role as "SUPERADMIN" | "ADMIN" | "USER" | "VIEWER",
		isActive: data.isActive,
	});

	// 9. Invalidar caché y refrescar datos
	void getUserList().refresh();
	void getUserDetails({ id: data.id }).refresh();
});
