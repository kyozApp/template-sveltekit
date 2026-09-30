import * as v from "valibot";

/**
 * Cambiar estado de usuario
 */
export const userToggleStatusSchema = {
	body: v.object({
		id: v.pipe(
			v.string("El ID de usuario es obligatorio y debe ser un string."),
			v.uuid("El ID de usuario no es un UUID válido."),
		),
		isActive: v.boolean(),
	}),
};

export type UserToggleStatusBody = v.InferOutput<
	typeof userToggleStatusSchema.body
>;

/**
 * Eliminar lógicamente usuario (Soft Delete)
 */
export const userDeleteSchema = {
	body: v.object({
		id: v.pipe(
			v.string("El ID de usuario es obligatorio y debe ser un string."),
			v.uuid("El ID de usuario no es un UUID válido."),
		),
	}),
};

export type UserDeleteBody = v.InferOutput<typeof userDeleteSchema.body>;
