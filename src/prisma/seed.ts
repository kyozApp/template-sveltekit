import argon2 from "argon2";

import { db } from "./db.js";

const main = async () => {
	console.info("🧪 Iniciando seed de desarrollo (Catálogos y Pruebas)...\n");

	// 1. Usuarios Base por Rol (SUPERADMIN, ADMIN, SALES, VIEWER)
	const hasSuperadmin = await db.orm.public.User.first({ role: "SUPERADMIN" });

	if (!hasSuperadmin) {
		const user = await db.orm.public.User.create({
			name: "Super Administrador",
			username: "superadmin",
			email: "superadmin@gmail.com",
			password: await argon2.hash("superadmin123"),
			role: "SUPERADMIN",
			isActive: true,
			isDeleted: false,
		});
		console.info(
			`✅ Usuario SUPERADMIN (${user.username}) creado exitosamente.`,
		);
	}

	const hasItManager = await db.orm.public.User.first({ role: "ADMIN" });
	if (!hasItManager) {
		const user = await db.orm.public.User.create({
			name: "Administrador",
			username: "admin",
			email: "admin@gmail.com",
			password: await argon2.hash("admin123"),
			role: "ADMIN",
			isActive: true,
			isDeleted: false,
		});
		console.info(`✅ Usuario ADMIN (${user.username}) creado exitosamente.`);
	}

	const hasSales = await db.orm.public.User.first({ role: "USER" });
	if (!hasSales) {
		const user = await db.orm.public.User.create({
			name: "User",
			username: "user",
			email: "user@gmail.com",
			password: await argon2.hash("user1234"),
			role: "USER",
			isActive: true,
			isDeleted: false,
		});
		console.info(`✅ Usuario USER (${user.username}) creado exitosamente.`);
	}

	const hasViewer = await db.orm.public.User.first({ role: "VIEWER" });
	if (!hasViewer) {
		const user = await db.orm.public.User.create({
			name: "Auditor Visitante",
			username: "visitante",
			email: "visitante@gmail.com",
			password: await argon2.hash("visitante123"),
			role: "VIEWER",
			isActive: true,
			isDeleted: false,
		});
		console.info(`✅ Usuario VIEWER (${user.username}) creado exitosamente.`);
	}

	console.info("\n🧪 Seed de desarrollo finalizado con éxito.");
};

main()
	.catch((error) => {
		console.error("❌ Error ejecutando seed de desarrollo:", error);
		process.exit(1);
	})
	.finally(async () => {
		await db.close();
	});
