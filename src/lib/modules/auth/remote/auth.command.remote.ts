import { command, getRequestEvent } from "$app/server";

import { db } from "#lib/server/db.ts";

/**
 * Cierra sesión para un usuario eliminando el registro en base de datos.
 */
export const logoutUser = command(async () => {
	// 1. Obtener evento de la petición y cookie de sesión
	const event = getRequestEvent();
	const sessionId = event.cookies.get("session");

	// 2. Eliminar cookie de sesión en el cliente
	event.cookies.delete("session", { path: "/" });

	// 3. Eliminar sesión de la base de datos si existe
	if (sessionId) {
		await db.orm.public.Session.where({ id: sessionId }).delete();
	}
});
