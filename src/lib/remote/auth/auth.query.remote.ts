import { getRequestEvent, query } from "$app/server";

import * as v from "valibot";

import { authCheckSchema } from "#lib/validations/auth/auth.query.validation.ts";

/**
 * Comprueba la autenticidad del usuario actual.
 */
export const checkUserAuth = query(async () => {
	// 1. Obtener evento de la petición
	const event = getRequestEvent();

	// 2. Si no hay sesión activa, retornar estado no autenticado
	if (!event.locals.user || !event.locals.sessionToken) {
		const unauthenticated = v.parse(authCheckSchema.response, {
			authenticated: false,
		});
		return unauthenticated;
	}

	// 3. Obtener datos de la sesión del usuario
	const locals = event.locals as App.AuthenticatedLocals;

	// 4. Validar y retornar estado autenticado
	const authenticatedUser = v.parse(authCheckSchema.response, {
		authenticated: true,
		user: {
			id: locals.user.id,
			role: locals.user.role,
		},
	});
	return authenticatedUser;
});
