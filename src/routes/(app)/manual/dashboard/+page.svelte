<script lang="ts">
import {
	ChevronDown,
	ChevronRight,
	CircleCheck,
	Compass,
	Laptop,
	LayoutDashboard,
	LogOut,
	Moon,
	MousePointerClick,
	PanelLeft,
	ShieldCheck,
	Smartphone,
	Sparkles,
} from "@lucide/svelte";

const faqs = [
	{
		q: "¿El cambio entre tema claro y oscuro afecta a los demás usuarios?",
		a: "No. La preferencia de color es 100% individual y se guarda de forma segura en tu navegador. Puedes alternar entre modo oscuro o claro según la iluminación de tu lugar de trabajo sin modificar la vista de tus compañeros.",
	},
	{
		q: "¿Puedo utilizar la plataforma desde una tablet o teléfono móvil?",
		a: "Sí. Toda la aplicación está diseñada para adaptarse automáticamente a pantallas táctiles. El menú lateral se convierte en un panel deslizable y las tablas de datos permiten un desplazamiento horizontal fluido y cómodo.",
	},
	{
		q: "¿Por qué se cerró mi sesión si dejé la pantalla abierta?",
		a: "Para proteger la información confidencial de la empresa ante descuidos en oficinas o equipos compartidos, el sistema cierra automáticamente tu sesión tras un período prolongado de inactividad. Solo debes volver a escribir tu usuario y contraseña.",
	},
	{
		q: "¿A quién debo acudir si experimento un problema técnico o lentitud?",
		a: "Comunícate con el Administrador interno de tu empresa. Si se trata de una incidencia técnica general o de conectividad de red, tu administrador coordinará directamente con el equipo de soporte técnico designado.",
	},
];
</script>

<svelte:head>
	<title>Dashboard · Centro de Ayuda</title>
</svelte:head>

<header
	class="flex flex-col gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800"
>
	<nav
		class="flex items-center gap-2 text-xs font-semibold tracking-wide"
		aria-label="Navegación del manual"
	>
		<span
			class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
		>
			Módulo Principal
		</span>
		<span class="flex items-center text-zinc-400 dark:text-zinc-600">
			<ChevronRight size={14} />
		</span>
		<span class="text-zinc-500 dark:text-zinc-400">Dashboard</span>
	</nav>

	<div class="flex flex-col gap-1">
		<h1
			class="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl dark:text-zinc-100"
		>
			Dashboard
		</h1>
		<p
			class="text-sm leading-relaxed font-normal text-zinc-500 md:text-base dark:text-zinc-400"
		>
			Panel de control central, navegación, personalización visual y preguntas
			frecuentes de la plataforma.
		</p>
	</div>
</header>

<article class="flex flex-col gap-10">
	<!-- 1. Propósito del Dashboard -->
	<section id="introduccion" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<span
				class="inline-flex items-center gap-1.5 self-start rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
			>
				<LayoutDashboard size={14} />
				Punto de Partida
			</span>
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				¿Qué es el Dashboard?
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				El <strong>Dashboard (Panel de Control)</strong> es la pantalla
				principal que te recibe al iniciar sesión. Su objetivo es brindarte una
				vista centralizada y rápida del estado de tus operaciones, facilitando
				el acceso a los módulos que usas en tu día a día sin distracciones.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400"
				>
					<Sparkles size={20} />
				</div>
				<h4
					class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
				>
					Acceso Instantáneo
				</h4>
				<p
					class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
				>
					Toda la información clave de tu área se encuentra disponible en tiempo
					real, permitiéndote comenzar tu jornada sin esperas ni configuraciones
					complejas.
				</p>
			</div>

			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400"
				>
					<Laptop size={20} />
				</div>
				<h4
					class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
				>
					Diseño Adaptable
				</h4>
				<p
					class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
				>
					La interfaz se ajusta con fluidez a monitores de escritorio,
					computadoras portátiles, tablets y pantallas de teléfonos móviles.
				</p>
			</div>
		</div>
	</section>

	<!-- 2. Elementos del Entorno y Navegación -->
	<section id="controles-globales" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<span
				class="inline-flex items-center gap-1.5 self-start rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
			>
				<Compass size={14} />
				Navegación
			</span>
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				Controles Globales de la Interfaz
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Herramientas siempre accesibles en la parte superior y lateral de la
				pantalla:
			</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div class="flex items-center gap-2.5">
					<span
						class="flex items-center justify-center text-blue-600 dark:text-blue-400"
					>
						<PanelLeft size={18} />
					</span>
					<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
						Menú Lateral Colapsable
					</h4>
				</div>
				<p
					class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
				>
					Presiona el botón de menú en la esquina superior para colapsar la
					barra lateral. Esto amplía el espacio de lectura, ideal para
					visualizar tablas con muchas columnas.
				</p>
			</div>

			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div class="flex items-center gap-2.5">
					<span
						class="flex items-center justify-center text-blue-600 dark:text-blue-400"
					>
						<MousePointerClick size={18} />
					</span>
					<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
						Migas de Pan (Breadcrumbs)
					</h4>
				</div>
				<p
					class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
				>
					Ubicadas en la barra superior (ejemplo:
					<code
						class="rounded-md bg-zinc-200/70 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
						>DASHBOARD &gt; USUARIOS</code
					>). Indican tu posición actual y te permiten regresar a niveles
					anteriores con un solo clic.
				</p>
			</div>

			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div class="flex items-center gap-2.5">
					<span
						class="flex items-center justify-center text-blue-600 dark:text-blue-400"
					>
						<Moon size={18} />
					</span>
					<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
						Modo Claro y Oscuro
					</h4>
				</div>
				<p
					class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
				>
					Alterna entre modo claro u oscuro presionando el icono del sol/luna.
					Reduce el cansancio visual en jornadas nocturnas o ambientes de baja
					luz.
				</p>
			</div>

			<div
				class="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
			>
				<div class="flex items-center gap-2.5">
					<span
						class="flex items-center justify-center text-blue-600 dark:text-blue-400"
					>
						<LogOut size={18} />
					</span>
					<h4 class="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
						Cierre de Sesión Seguro
					</h4>
				</div>
				<p
					class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
				>
					El botón de salida en el extremo superior derecho desconecta tu cuenta
					y anula tu sesión en el servidor inmediatamente por seguridad.
				</p>
			</div>
		</div>
	</section>

	<!-- 3. Comodidad y Atajos -->
	<section id="atajos" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<span
				class="inline-flex items-center gap-1.5 self-start rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
			>
				<ShieldCheck size={14} />
				Productividad
			</span>
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				Atajos y Buenas Prácticas
			</h3>
		</div>

		<div
			class="rounded-2xl border border-blue-200/60 bg-blue-50/40 p-5 sm:p-6 dark:border-blue-900/40 dark:bg-blue-950/20"
		>
			<ul class="m-0 flex list-none flex-col gap-3.5 p-0">
				<li
					class="flex items-start gap-3 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
				>
					<span class="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
						<CircleCheck size={16} />
					</span>
					<div>
						<strong>Cierre rápido con tecla Escape (ESC)</strong>: Puedes cerrar
						cualquier ventana modal o diálogo emergente simplemente pulsando la
						tecla
						<code
							class="rounded-md bg-zinc-200/70 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
							>ESC</code
						>
						en tu teclado, sin necesidad de buscar la 'X' con el mouse.
					</div>
				</li>
				<li
					class="flex items-start gap-3 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
				>
					<span class="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
						<CircleCheck size={16} />
					</span>
					<div>
						<strong>Validaciones inmediatas</strong>: Si un campo obligatorio
						queda vacío o un dato no cumple el formato esperado, el sistema te
						lo indicará en texto rojo antes de enviar el formulario para evitar
						errores.
					</div>
				</li>
				<li
					class="flex items-start gap-3 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
				>
					<span class="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
						<CircleCheck size={16} />
					</span>
					<div>
						<strong>Navegación táctil en móviles</strong>: En smartphones, la
						barra lateral se convierte en un menú deslizante y las tablas
						permiten desplazamiento lateral cómodo con el dedo.
					</div>
				</li>
			</ul>
		</div>
	</section>

	<!-- 4. Preguntas Frecuentes Generales -->
	<section id="faqs" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<span
				class="inline-flex items-center gap-1.5 self-start rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
			>
				<Smartphone size={14} />
				Ayuda Rápida
			</span>
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				Preguntas Frecuentes del Sistema
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Respuestas directas a las consultas más usuales sobre el uso general de
				la plataforma:
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
