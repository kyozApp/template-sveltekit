import type {
	Handle,
	HandleServerError,
	HandleValidationError,
} from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { getTextDirection } from "#lib/paraglide/runtime";
import { paraglideMiddleware } from "#lib/paraglide/server";
import { db } from "#lib/server/db";

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace("%paraglide.lang%", locale)
					.replace("%paraglide.dir%", getTextDirection(locale)),
		});
	});

const handleSession: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get("session");

	if (!sessionId) {
		event.locals.user = null;
		event.locals.sessionToken = null;
		return resolve(event);
	}

	try {
		const session = await db.orm.public.Session.where({ id: sessionId })
			.include("user")
			.first();

		if (
			!session?.user ||
			new Date() > new Date(session.expiresAt) ||
			!session.user.isActive ||
			session.user.isDeleted
		) {
			if (session) {
				await db.orm.public.Session.where({ id: sessionId })
					.delete()
					.catch(() => {});
			}
			event.locals.user = null;
			event.locals.sessionToken = null;
			event.cookies.delete("session", { path: "/" });
			return resolve(event);
		}

		event.locals.user = {
			id: session.user.id,
			name: session.user.name,
			username: session.user.username,
			email: session.user.email,
			role: session.user.role,
		};
		event.locals.sessionToken = sessionId;
	} catch (e) {
		console.error("[HOOKS SERVER ERROR]:", e);
		event.locals.user = null;
		event.locals.sessionToken = null;
		event.cookies.delete("session", { path: "/" });
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleSession);

/**
 * Intercepta y sanitiza excepciones ocurridas en el servidor.
 */
export const handleError: HandleServerError = ({ error, event, status }) => {
	// Las rutas no encontradas (404) son normales y no deben registrarse como fallo interno (500)
	if (status === 404) {
		return {
			message: "Página no encontrada.",
		};
	}

	const err = error as (Error & { code?: string }) | undefined;

	if (
		err?.code === "ERR_INVALID_STATE" ||
		err?.name === "AbortError" ||
		err?.message?.includes("Controller is already closed")
	) {
		return;
	}

	console.error(`[SERVER ERROR] en ${event.url.pathname}:`, error);

	return {
		message: "Ocurrió un error inesperado en el servidor.",
	};
};

/**
 * Intercepta errores de validación de esquemas en peticiones o Remote Functions.
 */
export const handleValidationError: HandleValidationError = () => {
	return {
		message: "Solicitud no válida.",
	};
};
