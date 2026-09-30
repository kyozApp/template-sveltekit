import { db } from "../prisma/db.js";

/**
 * Para ejecutar este script:
 * ```bash
 * pnpm tsx --env-file=.env src/scripts/example.ts
 * ```
 */
const run = async (): Promise<void> => {
	console.info("🚀 Iniciando script de ejemplo...\n");

	// 1. Consulta de agregación (conteo) con Prisma 8
	const { total: totalUsers } = await db.orm.public.User.where({
		isDeleted: false,
	}).aggregate((fn) => ({ total: fn.count() }));
	console.info(`📊 Total de usuarios activos en el sistema: ${totalUsers}`);

	// 2. Obtener lista resumida de usuarios para demostración
	const users = await db.orm.public.User.where({ isDeleted: false })
		.select("name", "username", "role", "isActive")
		.limit(5)
		.all();

	console.info("\n📋 Muestra de usuarios (primeros 5):");
	console.table(users);

	console.info("\n✅ Script de ejemplo finalizado exitosamente.");
};

run()
	.catch((error) => {
		console.error("❌ Error ejecutando el script:", error);
		process.exit(1);
	})
	.finally(async () => {
		// Importante: Liberar y cerrar la conexión con la base de datos
		await db.close();
	});
