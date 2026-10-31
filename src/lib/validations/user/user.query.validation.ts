import * as v from "valibot";

import { ROLES } from "#lib/constants.ts";

/**
 * Listar usuarios
 */
export const userListSchema = {
	response: v.array(
		v.pipe(
			v.object({
				id: v.pipe(v.string(), v.uuid()),
				name: v.string(),
				username: v.string(),
				email: v.string(),
				role: v.picklist(ROLES),
				isActive: v.boolean(),
				createdAt: v.pipe(v.string(), v.isoTimestamp()),
				updatedAt: v.pipe(v.string(), v.isoTimestamp()),
			}),
			v.readonly(),
		),
	),
};

export type UserListItemResponse = v.InferOutput<
	typeof userListSchema.response
>[number];

/**
 * Obtener los detalles del usuario
 */
export const userDetailSchema = {
	params: v.object({
		id: v.pipe(
			v.string("El ID de usuario es obligatorio."),
			v.uuid("El ID de usuario no es válido."),
		),
	}),
	response: v.pipe(
		v.object({
			id: v.pipe(v.string(), v.uuid()),
			name: v.string(),
			username: v.string(),
			email: v.string(),
			role: v.picklist(ROLES),
			isActive: v.boolean(),
			createdAt: v.pipe(v.string(), v.isoTimestamp()),
			updatedAt: v.pipe(v.string(), v.isoTimestamp()),
		}),
		v.readonly(),
	),
};

export type UserDetailParams = v.InferOutput<typeof userDetailSchema.params>;
export type UserDetailResponse = v.InferOutput<
	typeof userDetailSchema.response
>;
