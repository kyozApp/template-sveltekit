import { db } from "../prisma/db.js";

/**
 * Responsabilidad única: Operación en base de datos.
 * Elimina de PostgreSQL las sesiones expiradas antes de la fecha indicada.
 */
const deleteExpiredSessions = async (
	beforeIsoDate: string,
): Promise<number> => {
	const deletedCount = await db.orm.public.Session.where((s) =>
		s.expiresAt.lt(beforeIsoDate),
	).deleteAndCount();

	return deletedCount;
};

/**
 * Responsabilidad única: Orquestar la tarea en segundo plano.
 * Ejecuta la eliminación, maneja el logging y captura posibles fallos.
 */
export const runSessionCleanup = async (): Promise<void> => {
	try {
		// 1. Obtener timestamp actual en formato ISO
		const now = new Date().toISOString();

		// 2. Eliminar sesiones expiradas y registrar total eliminado
		const deletedCount = await deleteExpiredSessions(now);

		// 3. Notificar en consola si se realizaron eliminaciones
		if (deletedCount > 0) {
			console.log(
				`[Session Cleanup] Se eliminaron ${deletedCount} sesiones expiradas.`,
			);
		}
	} catch (error) {
		console.error(
			"[ERROR] [Session Cleanup]: Fallo al depurar sesiones:",
			error,
		);
	}
};
