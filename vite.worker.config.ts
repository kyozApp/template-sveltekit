import { defineConfig } from "vite";

/**
 * Configuración de Vite exclusiva para compilar el worker de tareas en segundo plano.
 * Genera build/worker.js a partir de src/worker.ts usando el modo SSR de Vite (Node.js).
 */
export default defineConfig({
	build: {
		// Punto de entrada: el archivo TypeScript del worker
		ssr: "src/worker.ts",

		// Directorio de salida: junto al build de la web para un despliegue unificado
		outDir: "build",

		// No limpiar el directorio de salida para no sobreescribir build/index.js
		emptyOutDir: false,

		// Target Node.js 24 para compatibilidad con las nuevas características de Node.js
		target: "node24",

		rollupOptions: {
			output: {
				// Nombre fijo del archivo de salida
				entryFileNames: "worker.js",

				// Formato ESM nativo (compatible con "type": "module" del package.json)
				format: "esm",
			},
		},
	},
});
