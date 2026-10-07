import { form, getRequestEvent } from "$app/server";

import argon2 from "argon2";

import { db } from "#lib/server/db.ts";
import { authLoginSchema } from "#lib/validations/auth/auth.form.validation.ts";

/**
 * Inicia sesión para un usuario autenticando con Prisma y Argon2.
 */
export const loginUser = form(authLoginSchema.body, async (data) => {
	// 1. Obtener el evento de la petición
	const event = getRequestEvent();

	// 2. Buscar usuario por nombre de usuario
	const user = await db.orm.public.User.first({ username: data.username });
	if (!user) {
		return {
			success: false,
			error: "Usuario o contraseña incorrectos.",
		};
	}

	// 3. Validar estado activo de la cuenta
	if (!user.isActive) {
		return {
			success: false,
			error: "La cuenta se encuentra inactiva.",
		};
	}

	// 4. Verificar contraseña con Argon2
	const isPasswordValid = await argon2.verify(user.password, data.password);
	if (!isPasswordValid) {
		return {
			success: false,
			error: "Usuario o contraseña incorrectos.",
		};
	}

	// 5. Crear sesión en la base de datos con expiración a 12 horas
	const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 12);
	const session = await db.orm.public.Session.create({
		userId: user.id,
		expiresAt: expirationDate.toISOString(),
	});

	// 6. Configurar cookie segura de sesión
	// NOTA DE SEGURIDAD (Producción / Red Interna):
	// Se mantiene 'secure: false' para compatibilidad en entornos locales o despliegues HTTP en red interna (LAN).
	// Si se expone a través de un proxy inverso con HTTPS (SSL/TLS), cambiar a 'secure: true' o 'secure: import.meta.env.PROD'.
	event.cookies.set("session", session.id, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false,
		expires: expirationDate,
	});
});
