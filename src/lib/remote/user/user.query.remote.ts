import { error } from "@sveltejs/kit";
import { query } from "$app/server";

import * as v from "valibot";

import { assertAdminOrSuperAdmin } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import {
	userDetailSchema,
	userListSchema,
} from "#lib/validations/user/user.query.validation.ts";

/**
 * Obtiene el listado general de usuarios.
 */
export const getUserList = query(async () => {
	// 1. Validar permisos de administrador
	assertAdminOrSuperAdmin();

	// 2. Consultar listado general de usuarios (excluyendo eliminados)
	const users = await db.orm.public.User.where({ isDeleted: false })
		.select(
			"id",
			"name",
			"username",
			"email",
			"role",
			"isActive",
			"isDeleted",
			"deletedAt",
			"createdAt",
			"updatedAt",
		)
		.orderBy((u) => u.createdAt.desc())
		.all();

	// 3. Validar y tipar datos retornados
	const userList = v.parse(userListSchema.response, users);
	return userList;
});

/**
 * Obtiene los detalles de un usuario específico.
 */
export const getUserDetails = query(userDetailSchema.params, async (data) => {
	// 1. Validar permisos de administrador
	assertAdminOrSuperAdmin();

	// 2. Consultar detalle del usuario en la base de datos
	const user = await db.orm.public.User.where({ id: data.id })
		.select(
			"id",
			"name",
			"username",
			"email",
			"role",
			"isActive",
			"isDeleted",
			"deletedAt",
			"createdAt",
			"updatedAt",
		)
		.first();

	// 3. Validar existencia del registro
	if (!user) {
		error(404, "El usuario no se encontró.");
	}

	// 4. Validar y tipar datos retornados
	const userDetail = v.parse(userDetailSchema.response, user);
	return userDetail;
});
