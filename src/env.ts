import { defineEnvVars } from "@sveltejs/kit/env";

import * as v from "valibot";

/**
 * Definición y validación de variables de entorno de la aplicación.
 *
 * Propiedades configurables por variable:
 * - public: Si es `true`, se expone al cliente ($app/env/public). Si es `false`, solo vive en el servidor ($app/env/private).
 * - static: Si es `true`, su valor se incrusta en compilación (build time). Si es `false`, se lee dinámicamente al arrancar (runtime).
 */
export const variables = defineEnvVars({
	PORT: {
		public: false,
		static: false,
		description: "Puerto de ejecución del servidor",
		schema: v.pipe(v.string(), v.toNumber(), v.number()),
	},
	ORIGIN: {
		public: false,
		static: false,
		description: "Origen URL base de la aplicación",
		schema: v.pipe(v.string(), v.url()),
	},
	DATABASE_URL: {
		public: false,
		static: false,
		description: "Cadena de conexión a PostgreSQL para Prisma ORM",
		schema: v.pipe(v.string(), v.nonEmpty("DATABASE_URL es requerida")),
	},
});
