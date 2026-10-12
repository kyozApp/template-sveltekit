import { error } from "@sveltejs/kit";
import { command } from "$app/server";

import { assertAuthenticated } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import { profileRevokeSessionSchema } from "#lib/validations/profile/profile.command.validation.ts";

import { getProfileData } from "./profile.query.remote.ts";

/**
 * Revoca una sesión activa específica del usuario.
 */
export const revokeProfileSession = command(
	profileRevokeSessionSchema.body,
	async (data) => {
		// 1. Validar autenticación
		const actor = assertAuthenticated();

		// 2. Prohibir auto-revocación desde este endpoint (para eso está logoutUser)
		if (data.sessionId === actor.sessionToken) {
			error(
				400,
				"No puedes revocar tu sesión activa actual desde aquí. Usa el botón Salir.",
			);
		}

		// 3. Validar que la sesión pertenece al usuario en sesión
		const session = await db.orm.public.Session.where({
			id: data.sessionId,
		}).first();
		if (!session || session.userId !== actor.user.id) {
			error(404, "La sesión no existe o no te pertenece.");
		}

		// 4. Eliminar sesión
		await db.orm.public.Session.where({ id: data.sessionId }).delete();

		// 5. Refrescar datos
		void getProfileData().refresh();
	},
);
