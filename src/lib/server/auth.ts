import { error } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";

import { hasPermission, type Permission } from "#lib/constants.ts";

export const assertAuthenticated = (): App.AuthenticatedLocals => {
	const event = getRequestEvent();
	if (!event.locals.user || !event.locals.sessionToken) {
		error(401, "No autorizado.");
	}

	return event.locals as App.AuthenticatedLocals;
};

export const assertPermission = (
	permission: Permission,
): App.AuthenticatedLocals => {
	const locals = assertAuthenticated();

	if (!hasPermission(locals.user.role, permission)) {
		error(403, "No tienes permiso para realizar esta acción.");
	}

	return locals;
};
