import * as v from "valibot";

/**
 * Esquema de revocación de sesión individual
 */
export const profileRevokeSessionSchema = {
	body: v.object({
		sessionId: v.pipe(
			v.string("El identificador de sesión no es válido."),
			v.uuid("El identificador de sesión debe ser un UUID válido."),
		),
	}),
};

export type ProfileRevokeSessionBody = v.InferOutput<
	typeof profileRevokeSessionSchema.body
>;
