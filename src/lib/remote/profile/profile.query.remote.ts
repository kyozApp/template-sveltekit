import { error } from "@sveltejs/kit";
import { query } from "$app/server";

import { assertAuthenticated } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";

/**
 * Consulta la información del perfil del usuario en sesión y sus sesiones activas.
 */
export const getProfileData = query(async () => {
	// 1. Validar autenticación
	const actor = assertAuthenticated();

	// 2. Obtener datos actualizados del usuario
	const user = await db.orm.public.User.where({ id: actor.user.id })
		.select(
			"id",
			"name",
			"username",
			"email",
			"role",
			"isActive",
			"createdAt",
			"updatedAt",
		)
		.first();

	if (!user) {
		error(404, "El usuario no existe o ha sido desactivado.");
	}

	// 3. Consultar sesiones activas del usuario
	const now = Date.now();
	const rawSessions = await db.orm.public.Session.where({
		userId: actor.user.id,
	})
		.select("id", "expiresAt", "createdAt")
		.orderBy((s) => s.createdAt.desc())
		.all();

	// Filtrar sesiones no expiradas comparando timestamps
	const sessions = rawSessions
		.filter((s) => new Date(s.expiresAt).getTime() > now)
		.map((s) => ({
			id: s.id,
			createdAt: s.createdAt,
			expiresAt: s.expiresAt,
			isCurrent: s.id === actor.sessionToken,
		}));

	return {
		user,
		sessions,
	};
});
