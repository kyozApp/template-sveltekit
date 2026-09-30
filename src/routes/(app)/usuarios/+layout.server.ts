import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent }) => {
	// Obtiene el usuario autenticado desde el layout parent
	const { user } = await parent();

	// Bloquea el acceso a usuarios sin rol de administración (SUPERADMIN, ADMIN)
	if (user.role !== "SUPERADMIN" && user.role !== "ADMIN") {
		redirect(302, "/");
	}
};
