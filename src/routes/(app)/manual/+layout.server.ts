import { redirect } from "@sveltejs/kit";

import { hasPermission } from "#lib/constants.ts";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent }) => {
	// 1. Obtener el usuario autenticado desde el layout parent
	const { user } = await parent();

	// 2. Bloquear el acceso a usuarios sin permiso de lectura del manual
	if (!hasPermission(user.role, "manual:view")) {
		redirect(302, "/dashboard");
	}
};
