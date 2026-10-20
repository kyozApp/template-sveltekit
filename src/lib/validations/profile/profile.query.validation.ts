import * as v from "valibot";

import { ROLES } from "#lib/constants.ts";

/**
 * Esquema de respuesta para los datos del perfil y sesiones
 */
export const profileDataSchema = {
	response: v.object({
		user: v.object({
			id: v.pipe(v.string(), v.uuid()),
			name: v.string(),
			username: v.string(),
			email: v.string(),
			role: v.picklist(ROLES),
			isActive: v.boolean(),
			createdAt: v.pipe(v.string(), v.isoTimestamp()),
			updatedAt: v.pipe(v.string(), v.isoTimestamp()),
		}),
		sessions: v.array(
			v.object({
				id: v.string(),
				createdAt: v.string(),
				expiresAt: v.string(),
				isCurrent: v.boolean(),
			}),
		),
	}),
};

export type ProfileDataResponse = v.InferOutput<
	typeof profileDataSchema.response
>;
