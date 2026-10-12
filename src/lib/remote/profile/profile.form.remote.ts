import { form } from "$app/server";

import argon2 from "argon2";

import { assertAuthenticated } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import {
	profilePasswordChangeSchema,
	profileUpdateSchema,
} from "#lib/validations/profile/profile.form.validation.ts";

import { getUserDetails, getUserList } from "../user/user.query.remote.ts";
import { getProfileData } from "./profile.query.remote.ts";

/**
 * Actualiza los datos personales (Nombre, Usuario, Correo) del usuario en sesión.
 */
export const updateProfile = form(profileUpdateSchema.body, async (data) => {
	// 1. Validar autenticación
	const actor = assertAuthenticated();

	// 2. Obtener usuario actual
	const existing = await db.orm.public.User.where({
		id: actor.user.id,
	}).first();
	if (!existing) {
		return {
			success: false,
			error: "Usuario no encontrado.",
		};
	}

	// 3. Validar unicidad si modificó nombre de usuario
	if (data.username !== existing.username) {
		const taken = await db.orm.public.User.first({
			username: data.username,
		});
		if (taken) {
			return {
				success: false,
				error: "El nombre de usuario ya se encuentra registrado.",
			};
		}
	}

	// 4. Validar unicidad si modificó correo electrónico
	if (data.email !== existing.email) {
		const taken = await db.orm.public.User.first({ email: data.email });
		if (taken) {
			return {
				success: false,
				error: "El correo electrónico ya se encuentra registrado.",
			};
		}
	}

	// 5. Aplicar cambios en base de datos
	await db.orm.public.User.where({ id: actor.user.id }).update({
		name: data.name,
		username: data.username,
		email: data.email,
	});

	// 6. Refrescar datos reactivos
	void getProfileData().refresh();
	void getUserList().refresh();
	void getUserDetails({ id: actor.user.id }).refresh();
});

/**
 * Cambia la contraseña del usuario en sesión y revoca todas las demás sesiones activas.
 */
export const changeProfilePassword = form(
	profilePasswordChangeSchema.body,
	async (data) => {
		// 1. Validar autenticación
		const actor = assertAuthenticated();

		// 2. Obtener credenciales actuales del usuario
		const user = await db.orm.public.User.where({
			id: actor.user.id,
		}).first();
		if (!user) {
			return {
				success: false,
				error: "Usuario no encontrado.",
			};
		}

		// 3. Verificar contraseña actual con Argon2
		const isPasswordValid = await argon2.verify(
			user.password,
			data.currentPassword,
		);
		if (!isPasswordValid) {
			return {
				success: false,
				error: "La contraseña actual no es correcta.",
			};
		}

		// 4. Hashear nueva contraseña
		const newHashedPassword = await argon2.hash(data.newPassword);

		// 5. Actualizar en base de datos
		await db.orm.public.User.where({ id: actor.user.id }).update({
			password: newHashedPassword,
		});

		// 6. Revocar todas las sesiones del usuario excepto la actual
		const allSessions = await db.orm.public.Session.where({
			userId: actor.user.id,
		}).all();

		for (const s of allSessions) {
			if (s.id !== actor.sessionToken) {
				await db.orm.public.Session.where({ id: s.id }).delete();
			}
		}

		// 7. Refrescar estado
		void getProfileData().refresh();
	},
);
