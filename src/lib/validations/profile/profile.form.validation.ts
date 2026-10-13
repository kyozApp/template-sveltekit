import * as v from "valibot";

/**
 * Esquema de actualización de datos de perfil
 */
export const profileUpdateSchema = {
	body: v.object({
		name: v.pipe(
			v.string("El nombre ingresado no es válido."),
			v.trim(),
			v.nonEmpty("El nombre completo es obligatorio."),
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
			v.nonEmpty("El usuario es obligatorio."),
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
			v.nonEmpty("El correo electrónico es obligatorio."),
			v.email(
				"Ingresa un correo electrónico válido (ejemplo: nombre@correo.com).",
			),
			v.maxLength(
				255,
				"El correo electrónico no puede superar los 255 caracteres.",
			),
		),
	}),
};

export type ProfileUpdateBody = v.InferOutput<typeof profileUpdateSchema.body>;

/**
 * Esquema de cambio de contraseña
 */
export const profilePasswordChangeSchema = {
	body: v.pipe(
		v.object({
			currentPassword: v.pipe(
				v.string("La contraseña actual es obligatoria."),
				v.nonEmpty("Ingresa tu contraseña actual."),
			),
			newPassword: v.pipe(
				v.string("La nueva contraseña ingresada no es válida."),
				v.nonEmpty("La nueva contraseña es obligatoria."),
				v.minLength(8, "La nueva contraseña debe tener al menos 8 caracteres."),
				v.maxLength(255, "La contraseña no puede superar los 255 caracteres."),
			),
			confirmPassword: v.pipe(
				v.string("La confirmación de contraseña es obligatoria."),
				v.nonEmpty("Confirma tu nueva contraseña."),
			),
		}),
		v.check(
			(input) => input.newPassword === input.confirmPassword,
			"La nueva contraseña y la confirmación no coinciden.",
		),
	),
};

export type ProfilePasswordChangeBody = v.InferOutput<
	typeof profilePasswordChangeSchema.body
>;
