import * as v from "valibot";

import { ROLES } from "#lib/constants";

/**
 * Login de usuario
 */
export const authLoginSchema = {
	body: v.object({
		username: v.pipe(
			v.string("El usuario ingresado no es válido."),
			v.trim(),
			v.toLowerCase(),
			v.minLength(1, "El usuario es obligatorio."),
			v.minLength(3, "El usuario debe tener al menos 3 caracteres."),
		),
		password: v.pipe(
			v.string("La contraseña ingresada no es válida."),
			v.minLength(1, "La contraseña es obligatoria."),
			v.minLength(8, "La contraseña debe tener al menos 8 letras o números."),
		),
	}),
	response: v.pipe(
		v.object({
			token: v.string(),
			user: v.object({
				id: v.pipe(v.string(), v.uuid()),
				name: v.string(),
				username: v.string(),
				email: v.string(),
				role: v.picklist(ROLES),
			}),
		}),
		v.readonly(),
	),
};

export type AuthLoginBody = v.InferOutput<typeof authLoginSchema.body>;
export type AuthLoginResponse = v.InferOutput<typeof authLoginSchema.response>;
