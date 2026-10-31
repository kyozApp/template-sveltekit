import { redirect } from "@sveltejs/kit";

import { hasPermission } from "#lib/constants.ts";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	// 1. Obtener el usuario autenticado desde el layout parent
	const { user } = await parent();

	// 2. Bloquear el acceso a usuarios sin permiso de lectura del manual de usuarios
	if (!hasPermission(user.role, "manual:users:view")) {
		redirect(302, "/manual/plantilla");
	}
};
