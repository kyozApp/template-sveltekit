import { form } from "$app/server";

import argon2 from "argon2";

import { assertAdminOrSuperAdmin } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import {
	userCreateSchema,
	userUpdateSchema,
} from "#lib/validations/user/user.form.validation.ts";

import { getProfileData } from "../profile/profile.query.remote.ts";
import { getUserDetails, getUserList } from "./user.query.remote.ts";

/**
 * Registra un nuevo usuario en el sistema.
 */
export const createUser = form(userCreateSchema.body, async (data) => {
	// 1. Validar permisos de administrador
	assertAdminOrSuperAdmin();

	// 2. Validar disponibilidad de nombre de usuario y correo
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

	// 3. Hashear la contraseña con Argon2
	const hashedPassword = await argon2.hash(data.password);

	// 4. Insertar nuevo usuario en la base de datos
	await db.orm.public.User.create({
		name: data.name,
		username: data.username,
		email: data.email,
		password: hashedPassword,
		role: data.role,
		isActive: data.isActive,
		isDeleted: false,
	});

	// 5. Invalidar caché y refrescar el listado
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

	// 3. Reglas de auto-edición:
	// A. Nadie puede alterar su propio rol
	if (actor.user.id === data.id) {
		data.role = actor.user.role;
	}

	// B. Nadie puede desactivar su propia cuenta en sesión
	if (actor.user.id === data.id && data.isActive === false) {
		return {
			success: false,
			error: "No puedes desactivar tu propia cuenta en sesión.",
		};
	}

	// 4. Validar duplicidad de nombre de usuario y correo
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

	// 5. Hashear la nueva contraseña si fue provista
	let hashedPassword: string | undefined;
	if (data.password) {
		hashedPassword = await argon2.hash(data.password);
	}

	// 6. Revocar sesiones activas si el usuario es desactivado
	if (data.isActive === false) {
		await db.orm.public.Session.where({ userId: data.id }).deleteAll();
	}

	// 7. Actualizar usuario en la base de datos
	await db.orm.public.User.where({ id: data.id }).update({
		name: data.name,
		username: data.username,
		email: data.email,
		...(hashedPassword ? { password: hashedPassword } : {}),
		role: data.role,
		isActive: data.isActive,
	});

	// 8. Invalidar caché y refrescar datos
	void getUserList().refresh();
	void getUserDetails({ id: data.id }).refresh();
	void getProfileData().refresh();
});
