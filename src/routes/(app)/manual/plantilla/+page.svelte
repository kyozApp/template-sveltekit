<script lang="ts">
import {
	ChevronDown,
	FolderTree,
	Lock,
	Palette,
	ShieldCheck,
	Zap,
} from "@lucide/svelte";

const faqs = [
	{
		q: "¿Cómo creo un nuevo módulo o pantalla dentro del panel?",
		a: "Crea una nueva carpeta dentro de 'src/routes/(app)/nombre-modulo/' con su respectivo '+page.svelte' (y '+page.server.ts' si necesitas cargar datos del servidor). Al estar dentro del grupo de rutas (app), la nueva página heredará automáticamente el layout principal con la barra lateral, cabecera y protección de autenticación.",
	},
	{
		q: "¿Cómo restrinjo una página para que solo los Administradores tengan acceso?",
		a: "En el archivo '+page.server.ts' de la ruta, verifica 'locals.user.role'. Si el rol no es 'ADMIN', ejecuta un 'redirect(307, resolve(\"dashboard\"))'. También puedes ocultar el enlace de navegación en 'AppSidebar.svelte' usando la condición 'isAdmin'.",
	},
	{
		q: "¿Por qué se utiliza Svelte 5 Runes ($state, $derived, $effect) en toda la plantilla?",
		a: "Svelte 5 introduce el sistema de reactividad universal mediante Runes, lo que permite un control granular de estado sin necesidad de tiendas ($store) complejas ni sintaxis mágica de asignaciones reactivas ($:). Esto mejora el rendimiento, simplifica el tipado con TypeScript y facilita el mantenimiento del código.",
	},
	{
		q: "¿Dónde se gestiona el acceso a datos y las mutaciones?",
		a: "Siguiendo la arquitectura desacoplada de la plantilla, todas las consultas y acciones hacia el backend se concentran en 'src/lib/remote/'. Esto mantiene las vistas y formularios limpios de lógica pesada de infraestructura.",
	},
];
</script>

<svelte:head>
	<title>Plantilla · Centro de Ayuda</title>
</svelte:head>

<header
	class="flex flex-col gap-1 border-b border-zinc-200 pb-6 dark:border-zinc-800"
>
	<h1
		class="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl dark:text-zinc-100"
	>
		Manual de la Plantilla
	</h1>
	<p
		class="text-sm leading-relaxed font-normal text-zinc-500 md:text-base dark:text-zinc-400"
	>
		Guía base de arquitectura, tecnologías integradas, convenciones y flujo de
		desarrollo para iniciar nuevos proyectos sobre este repositorio.
	</p>
</header>

<article class="flex flex-col gap-10">
	<!-- 1. Visión General -->
	<section id="vision-general" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				1. Visión General y Propósito
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Esta plantilla (<strong>template-sveltekit</strong>) ha sido diseñada
				como una base robusta, moderna y lista para producción, permitiéndote
				iniciar aplicaciones SaaS, paneles administrativos o plataformas
				empresariales sin tener que configurar autenticación, roles o diseño
				desde cero.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400"
				>
					<Zap size={20} />
				</div>
				<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
					Svelte 5 Universal
				</h4>
				<p class="m-0 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
					Reactividad limpia con Runes (<code class="font-mono text-xs"
						>$state</code
					>,
					<code class="font-mono text-xs">$derived</code>,
					<code class="font-mono text-xs">$props</code>) sin tiendas obsoletas.
				</p>
			</div>

			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400"
				>
					<Lock size={20} />
				</div>
				<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
					Seguridad y Sesiones
				</h4>
				<p class="m-0 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
					Cookies <code class="font-mono text-xs">httpOnly</code>, roles (ADMIN
					/ USER) y vigilancia pasiva de expiración en tiempo real.
				</p>
			</div>

			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-400"
				>
					<Palette size={20} />
				</div>
				<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
					Tailwind CSS v4
				</h4>
				<p class="m-0 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
					Diseño 100% utilitario, cero bloques de estilo heredados y soporte
					nativo de modo claro y oscuro.
				</p>
			</div>

			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400"
				>
					<ShieldCheck size={20} />
				</div>
				<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
					TypeScript Estricto
				</h4>
				<p class="m-0 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
					Tipado estricto en layouts, páginas, locals de servidor y componentes
					para evitar errores en tiempo de ejecución.
				</p>
			</div>
		</div>
	</section>

	<!-- 2. Arquitectura y Tecnologías -->
	<section id="arquitectura" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				2. Arquitectura y Tecnologías
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				La solución adopta las mejores prácticas y estándares de la comunidad de
				SvelteKit:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<ul
				class="m-0 flex list-disc flex-col gap-3 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					<strong>SvelteKit 2:</strong>
					Enrutamiento basado en archivos, carga de datos con SSR (Server-Side
					Rendering) y shallow routing para modales elegantes sin recargar la
					página.
				</li>
				<li>
					<strong>Svelte 5 Runes:</strong>
					Sin componentes complejos de wrapper de estado. Los datos y estados
					reactivos fluyen de forma transparente mediante props fuertemente
					tipadas.
				</li>
				<li>
					<strong>Drizzle ORM:</strong>
					Consultas a base de datos eficientes, migraciones seguras y tipado
					estricto integrado desde el esquema hasta el cliente.
				</li>
				<li>
					<strong>Tailwind CSS v4:</strong>
					Sin archivos CSS inflados. Uso de clases utilitarias estándar y
					variante
					<code
						class="rounded-md bg-zinc-200/70 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800"
						>dark:</code
					>
					para soportar contraste automático.
				</li>
				<li>
					<strong>Biome:</strong>
					Herramienta ultrarrápida de linting y formateo automatizado que
					garantiza código limpio, consistente y libre de errores sintácticos.
				</li>
			</ul>
		</div>
	</section>

	<!-- 3. Estructura de Directorios -->
	<section id="estructura" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				3. Estructura de Directorios
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				El proyecto organiza las responsabilidades de forma predecible:
			</p>
		</div>

		<div
			class="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 font-mono text-xs text-zinc-800 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-200"
		>
			<div
				class="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400"
			>
				<FolderTree size={16} />
				<span>src/</span>
			</div>
			<div
				class="flex flex-col gap-1.5 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700"
			>
				<div>
					<strong>routes/(app)/</strong>: Zona autenticada protegida. Contiene
					la barra lateral, cabecera y módulos privados.
				</div>
				<div>
					<strong>routes/(auth)/</strong>: Zona pública de inicio de sesión y
					recuperación de credenciales.
				</div>
				<div>
					<strong>lib/components/</strong>: Componentes visuales reutilizables
					(modales, cabecera, sidebar, formularios).
				</div>
				<div>
					<strong>lib/remote/</strong>: Funciones remotas tipadas para
					interactuar con la base de datos y lógica de negocio.
				</div>
				<div>
					<strong>lib/services/</strong>: Servicios reactivos compartidos
					(notificaciones toast, preferencias de usuario).
				</div>
				<div>
					<strong>lib/server/</strong>: Lógica exclusiva del servidor (base de
					datos, hashes de contraseñas, validación de sesiones).
				</div>
			</div>
		</div>
	</section>

	<!-- 4. Preguntas Frecuentes -->
	<section id="faqs" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				Preguntas Frecuentes de la Plantilla
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Respuestas a las dudas más frecuentes al comenzar a construir sobre esta
				base:
			</p>
		</div>

		<div class="flex flex-col gap-3">
			{#each faqs as { q, a }}
				<details
					class="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors duration-150 open:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:open:border-blue-700"
				>
					<summary
						class="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-bold text-zinc-900 transition-colors duration-150 outline-none select-none hover:text-blue-600 sm:p-5 dark:text-zinc-100 dark:hover:text-blue-400 [&::-webkit-details-marker]:hidden"
					>
						<span>{q}</span>
						<span
							class="flex shrink-0 items-center justify-center text-zinc-400 transition-transform duration-200 group-open:rotate-180 dark:text-zinc-500"
						>
							<ChevronDown size={18} />
						</span>
					</summary>
					<div
						class="border-t border-zinc-100 px-4 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5 dark:border-zinc-800"
					>
						<p
							class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
						>
							{a}
						</p>
					</div>
				</details>
			{/each}
		</div>
	</section>
</article>
