import { CronJob } from "cron";

import { db } from "./prisma/db.js";
import { runSessionCleanup } from "./tasks/sessionCleanup.task.js";

const jobs: CronJob[] = [];

export const initBackgroundTasks = (): void => {
	console.log("Iniciando tareas programadas en segundo plano...");

	// 1. Limpieza de Sesiones Expiradas - Cada 6 horas
	const cleanupJob = new CronJob("0 */6 * * *", () => {
		void runSessionCleanup();
	});
	jobs.push(cleanupJob);
	cleanupJob.start();

	// Ejecución inicial inmediata para arranque
	void runSessionCleanup();
};

export const stopBackgroundTasks = (): void => {
	for (const job of jobs) {
		job.stop();
	}
	jobs.length = 0;
	console.log("Tareas en segundo plano detenidas.");
};

/**
 * Responsabilidad única: Desconectar y liberar el pool de conexiones de Prisma 8.
 */
const closeDatabaseConnection = async (): Promise<void> => {
	try {
		await db.close();
		console.log("Conexión con la base de datos cerrada.");
	} catch (error) {
		console.error("Error cerrando conexión con la base de datos:", error);
	}
};

/**
 * Responsabilidad única: Coordinar la secuencia de apagado ordenado del worker.
 */
const handleGracefulShutdown = async (signal: string): Promise<void> => {
	console.log(`\nWorker detenido vía ${signal}. Cerrando recursos...`);
	stopBackgroundTasks();
	await closeDatabaseConnection();
	process.exit(0);
};

/**
 * Responsabilidad única: Registrar los listeners de señales del sistema operativo.
 */
const setupShutdownHandlers = (): void => {
	process.on("SIGTERM", () => void handleGracefulShutdown("SIGTERM"));
	process.on("SIGINT", () => void handleGracefulShutdown("SIGINT"));
};

// 1. Iniciar tareas en segundo plano
initBackgroundTasks();

// 2. Registrar manejadores de cierre del proceso
setupShutdownHandlers();
