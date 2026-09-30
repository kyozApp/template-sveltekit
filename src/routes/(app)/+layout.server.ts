import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	// Verificar si el usuario está autenticado
	if (!locals.user) {
		redirect(302, "/iniciar-sesion");
	}

	// Retornar información básica del usuario
	return {
		user: locals.user,
	};
};
