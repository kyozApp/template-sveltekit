import * as v from "valibot";

import { ROLES } from "#lib/constants";

/**
 * Crear usuario
 */
export const userCreateSchema = {
	body: v.object({
		name: v.pipe(
			v.string("El nombre ingresado no es válido."),
			v.trim(),
			v.minLength(1, "El nombre completo es obligatorio."),
			v.minLength(3, "El nombre completo debe tener al menos 3 letras."),
			v.maxLength(
				255,
				"El nombre completo no puede superar los 255 caracteres.",
			),
		),
		username: v.pipe(
			v.string("El usuario ingresado no es válido."),
			v.trim(),
			v.toLowerCase(),
			v.minLength(1, "El usuario es obligatorio."),
			v.minLength(3, "El usuario debe tener al menos 3 caracteres."),
			v.maxLength(
				255,
				"El nombre de usuario no puede superar los 255 caracteres.",
			),
		),
		email: v.pipe(
			v.string("El correo electrónico ingresado no es válido."),
			v.trim(),
			v.toLowerCase(),
			v.minLength(1, "El correo electrónico es obligatorio."),
			v.email(
				"Ingresa un correo electrónico válido (ejemplo: nombre@correo.com).",
			),
			v.maxLength(
				255,
				"El correo electrónico no puede superar los 255 caracteres.",
			),
		),
		password: v.pipe(
			v.string("La contraseña ingresada no es válida."),
			v.minLength(1, "La contraseña es obligatoria."),
			v.minLength(8, "La contraseña debe tener al menos 8 letras o números."),
			v.maxLength(255, "La contraseña no puede superar los 255 caracteres."),
		),
		role: v.pipe(
			v.optional(v.string(), ""),
			v.picklist(
				["ADMIN", "USER", "VIEWER"],
				"Selecciona un rol válido de la lista.",
			),
		),
		isActive: v.optional(v.boolean(), true),
	}),
};

export type UserCreateBody = v.InferOutput<typeof userCreateSchema.body>;

/**
 * Actualizar usuario
 */
export const userUpdateSchema = {
	body: v.object({
		id: v.pipe(
			v.string(
				"El identificador de usuario no es válido y debe ser un string.",
			),
			v.uuid("El identificador de usuario no es un UUID válido."),
		),
		name: v.pipe(
			v.string("El nombre ingresado no es válido."),
			v.trim(),
			v.minLength(1, "El nombre completo es obligatorio."),
			v.minLength(3, "El nombre completo debe tener al menos 3 letras."),
			v.maxLength(
				255,
				"El nombre completo no puede superar los 255 caracteres.",
			),
		),
		username: v.pipe(
			v.string("El usuario ingresado no es válido."),
			v.trim(),
			v.toLowerCase(),
			v.minLength(1, "El usuario es obligatorio."),
			v.minLength(3, "El usuario debe tener al menos 3 caracteres."),
			v.maxLength(
				255,
				"El nombre de usuario no puede superar los 255 caracteres.",
			),
		),
		email: v.pipe(
			v.string("El correo electrónico ingresado no es válido."),
			v.trim(),
			v.toLowerCase(),
			v.minLength(1, "El correo electrónico es obligatorio."),
			v.email(
				"Ingresa un correo electrónico válido (ejemplo: nombre@correo.com).",
			),
			v.maxLength(
				255,
				"El correo electrónico no puede superar los 255 caracteres.",
			),
		),
		password: v.optional(
			v.pipe(
				v.string("La contraseña ingresada no es válida."),
				v.trim(),
				v.transform((val) => (val === "" ? undefined : val)),
				v.union([
					v.undefined(),
					v.pipe(
						v.string(),
						v.minLength(
							8,
							"La contraseña debe tener al menos 8 letras o números.",
						),
						v.maxLength(
							255,
							"La contraseña no puede superar los 255 caracteres.",
						),
					),
				]),
			),
		),
		role: v.pipe(
			v.optional(v.string(), ""),
			v.picklist(ROLES, "Selecciona un rol válido de la lista."),
		),
		isActive: v.optional(v.boolean(), false),
	}),
};

export type UserUpdateBody = v.InferOutput<typeof userUpdateSchema.body>;
