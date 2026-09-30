import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const port = Number(env.PORT) || 5173;

	return {
		server: { port, host: true },
		preview: { port, host: true },
		plugins: [
			tailwindcss(),
			sveltekit({
				alias: { "#lib/*": "src/lib/*" },
				experimental: {
					explicitEnvironmentVariables: true,
					remoteFunctions: true,
				},
				compilerOptions: {
					experimental: { async: true },
					// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
				},
				adapter: adapter(),
			}),

			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/lib/paraglide",
				emitTsDeclarations: true,
			}),
		],
	};
});
