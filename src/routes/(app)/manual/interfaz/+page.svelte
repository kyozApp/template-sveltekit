<script lang="ts">
import { ChevronDown, LogOut, Moon, PanelLeft, Sun } from "@lucide/svelte";

const faqs = [
	{
		q: "¿El cambio entre tema claro y oscuro afecta a los demás usuarios?",
		a: "No. La preferencia de color es 100% individual y se almacena de forma segura en tu propio navegador. Puedes alternar entre modo oscuro o claro según las condiciones de luz de tu puesto de trabajo sin alterar la vista de tus compañeros.",
	},
	{
		q: "¿Por qué el sistema me cerró la sesión automáticamente?",
		a: "Para proteger la información corporativa confidencial ante descuidos o computadoras compartidas, el sistema implementa un monitor de seguridad en segundo plano. Si tu sesión expira por inactividad o tu cuenta es desactivada temporalmente por un administrador, la plataforma te notificará y te redirigirá al inicio de sesión de forma segura.",
	},
	{
		q: "¿Puedo navegar cómodamente desde una tablet o teléfono móvil?",
		a: "Sí. Toda la aplicación cuenta con diseño responsivo inteligente. En pantallas pequeñas, la barra lateral se oculta automáticamente para convertirse en un panel deslizable accesible mediante el botón de menú superior.",
	},
	{
		q: "¿Cómo cierro rápidamente un modal o el menú de usuario sin usar el ratón?",
		a: "Puedes pulsar en cualquier momento la tecla Escape (ESC) en tu teclado. Tanto el menú de usuario como todas las ventanas modales de la plataforma se cerrarán de inmediato.",
	},
];
</script>

<svelte:head>
	<title>Interfaz y Cuenta · Centro de Ayuda</title>
</svelte:head>

<header
	class="flex flex-col gap-1 border-b border-zinc-200 pb-6 dark:border-zinc-800"
>
	<h1
		class="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl dark:text-zinc-100"
	>
		Interfaz y Cuenta
	</h1>
	<p
		class="text-sm leading-relaxed font-normal text-zinc-500 md:text-base dark:text-zinc-400"
	>
		Guía sobre los controles globales de la cabecera, alternancia de tema, menú
		de perfil de usuario y cierre seguro de sesión.
	</p>
</header>

<article class="flex flex-col gap-10">
	<!-- 1. Modo Claro y Oscuro -->
	<section id="modo-color" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				1. Modo Claro y Oscuro
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				La plataforma incluye soporte completo para temas visuales claro y
				oscuro, pensado para brindar confort visual durante toda tu jornada:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
				>
					<Sun size={20} />
				</span>
				<div>
					<h4
						class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
					>
						Alternador de Tema (Sol / Luna)
					</h4>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						Ubicado en la parte superior derecha de la cabecera
					</span>
				</div>
			</div>

			<ol
				class="m-0 flex list-decimal flex-col gap-2.5 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					<strong>Cambio instantáneo:</strong>
					Haz clic sobre el icono de
					<span
						class="inline-flex size-6 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 align-middle text-zinc-600 shadow-2xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Sun size={13} class="hidden dark:inline" />
						<Moon size={13} class="inline dark:hidden" />
					</span>
					en la barra superior. La interfaz cambiará al instante sin recargar la
					pantalla.
				</li>
				<li>
					<strong>Persistencia automática:</strong>
					Tu preferencia se guarda localmente en el navegador, por lo que la
					próxima vez que entres a la plataforma se cargará tu tema favorito
					automáticamente.
				</li>
				<li>
					<strong>Sin parpadeo de carga (Anti-FOUC):</strong>
					El sistema detecta tu preferencia antes del renderizado para evitar
					destellos blancos al navegar.
				</li>
			</ol>
		</div>
	</section>

	<!-- 2. Menú de Perfil y Usuario -->
	<section id="menu-perfil" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				2. Menú de Usuario y Perfil
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				En el extremo superior derecho encontrarás tu avatar personal con tus
				iniciales:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-bold text-zinc-800 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
				>
					US
				</span>
				<div>
					<h4
						class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
					>
						Panel Desplegable de Usuario
					</h4>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						Información de cuenta, credenciales y accesos
					</span>
				</div>
			</div>

			<ol
				class="m-0 flex list-decimal flex-col gap-2.5 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					<strong>Abrir menú:</strong>
					Pulsa sobre el círculo con tus iniciales en la cabecera. Se desplegará
					un menú emergente.
				</li>
				<li>
					<strong>Consultar datos:</strong>
					En la cabecera del menú podrás ver tu nombre completo, tu correo
					corporativo y la insignia con tu rol asignado (<strong
						>Administrador</strong
					>
					o <strong>Usuario</strong>).
				</li>
				<li>
					<strong>Atajos de cierre:</strong>
					Para cerrar el menú sin realizar ninguna acción, haz clic en cualquier
					lugar fuera de él o presiona la tecla
					<code
						class="rounded-md bg-zinc-200/70 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800"
						>ESC</code
					>.
				</li>
			</ol>
		</div>
	</section>

	<!-- 3. Cierre de Sesión Seguro -->
	<section id="cierre-sesion" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				3. Cierre de Sesión Seguro
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Procedimiento recomendado para desconectarte al finalizar tu jornada o
				retirarte de tu equipo:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400"
				>
					<LogOut size={20} />
				</span>
				<div>
					<h4
						class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
					>
						Invalidación de Sesión en el Servidor
					</h4>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						Limpieza de cookies criptográficas y desconexión inmediata
					</span>
				</div>
			</div>

			<ol
				class="m-0 flex list-decimal flex-col gap-2.5 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					Abre tu menú de usuario presionando tu avatar en la barra superior.
				</li>
				<li>
					Haz clic en la opción <strong>"Cerrar Sesión"</strong> con el icono de
					salida
					<span
						class="inline-flex size-6 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 align-middle text-rose-600 shadow-2xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-rose-400"
					>
						<LogOut size={13} />
					</span
					>.
				</li>
				<li>
					El servidor anulará el token de tu sesión en la base de datos,
					destruirá la cookie segura
					<code
						class="rounded-md bg-zinc-200/70 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800"
						>httpOnly</code
					>
					y te redirigirá a la pantalla de inicio de sesión.
				</li>
				<li>
					<strong>Vigilante pasivo de sesión:</strong>
					La plantilla cuenta con un monitor que verifica silenciosamente el
					estado de tu cuenta cada 60 segundos. Si otro administrador desactiva
					tu usuario, el sistema cerrará tu sesión automáticamente para
					garantizar la seguridad.
				</li>
			</ol>
		</div>
	</section>

	<!-- 4. Barra Lateral y Navegación -->
	<section id="barra-lateral" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				4. Barra Lateral Colapsable y Navegación
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Controles para optimizar el área visible de la pantalla según la tarea
				que estés realizando:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
				>
					<PanelLeft size={20} />
				</span>
				<div>
					<h4
						class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
					>
						Maximizar Área de Contenido
					</h4>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						Expansión de tablas de datos y vistas complejas
					</span>
				</div>
			</div>

			<ol
				class="m-0 flex list-decimal flex-col gap-2.5 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					<strong>Colapsar barra lateral:</strong>
					Pulsa el botón de menú
					<span
						class="inline-flex size-6 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 align-middle text-zinc-600 shadow-2xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<PanelLeft size={13} />
					</span>
					en la esquina superior izquierda. La barra se reducirá a modo de
					iconos, dándole a tu contenido central hasta 200px adicionales de
					ancho.
				</li>
				<li>
					<strong>Expandir barra lateral:</strong>
					Vuelve a pulsar el botón para desplegar nuevamente los nombres
					completos de cada módulo.
				</li>
				<li>
					<strong>Adaptabilidad móvil:</strong>
					En dispositivos móviles con pantallas de hasta 768px, la barra lateral
					se cierra por defecto al entrar y se despliega como un menú flotante
					superior cuando la necesitas.
				</li>
			</ol>
		</div>
	</section>

	<!-- 5. Preguntas Frecuentes -->
	<section id="faqs" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				Preguntas Frecuentes sobre la Interfaz
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Respuestas a las preguntas más comunes sobre el uso de la interfaz y la
				cuenta:
			</p>
		</div>

		<div class="flex flex-col gap-3">
			{#each faqs as { q, a }}
				<details
					class="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors duration-150 open:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:open:border-zinc-600"
				>
					<summary
						class="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-bold text-zinc-900 transition-colors duration-150 outline-none select-none hover:text-zinc-600 sm:p-5 dark:text-zinc-100 dark:hover:text-zinc-300 [&::-webkit-details-marker]:hidden"
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
