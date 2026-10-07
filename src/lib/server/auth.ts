import { error } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";

import type { Role } from "#lib/constants.ts";

export const assertAuthenticated = (): App.AuthenticatedLocals => {
	const event = getRequestEvent();
	if (!event.locals.user || !event.locals.sessionToken) {
		error(401, "No autorizado.");
	}

	return event.locals as App.AuthenticatedLocals;
};

export const assertRole = (allowedRoles: Role[]): App.AuthenticatedLocals => {
	const locals = assertAuthenticated();

	if (
		locals.user.role !== "SUPERADMIN" &&
		!allowedRoles.includes(locals.user.role as Role)
	) {
		error(403, "No tienes permiso para realizar esta acción.");
	}

	return locals;
};

export const assertAdminOrSuperAdmin = (): App.AuthenticatedLocals => {
	return assertRole(["ADMIN"]);
};

export const assertSuperAdmin = (): App.AuthenticatedLocals => {
	return assertRole([]);
};

export const assertCanMutate = (): App.AuthenticatedLocals => {
	const locals = assertAuthenticated();
	if (locals.user.role === "VIEWER") {
		error(
			403,
			"Los usuarios con rol Visitante solo tienen permisos de lectura.",
		);
	}
	return locals;
};
