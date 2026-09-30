import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// Verificar si el usuario está autenticado
	if (locals.user) {
		redirect(302, "/dashboard");
	}
	// Redireccionar a login si el usuario no está autenticado
	redirect(302, "/iniciar-sesion");
};
