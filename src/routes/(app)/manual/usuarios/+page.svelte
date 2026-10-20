<script lang="ts">
import {
	ChevronDown,
	KeyRound,
	Pencil,
	ToggleRight,
	UserPlus,
} from "@lucide/svelte";

const faqs = [
	{
		q: "¿Qué sucede con las sesiones abiertas al marcar a un usuario como Inactivo?",
		a: "El sistema invalida de forma inmediata y global todas sus sesiones activas en cualquier navegador o dispositivo. El usuario será desconectado automáticamente en su siguiente petición y no podrá volver a iniciar sesión hasta que un administrador lo reactive.",
	},
	{
		q: "¿Por qué el interruptor de estado aparece bloqueado en mi propio usuario?",
		a: "Por políticas estrictas de seguridad de la plataforma, el sistema impide que un administrador se desactive a sí mismo para evitar bloqueos accidentales e irreversibles de acceso al panel principal.",
	},
	{
		q: "¿Qué sucede si dejo el campo 'Nueva Contraseña' en blanco al editar un usuario?",
		a: "Si no escribes nada en el campo de contraseña, el sistema conservará intacta la contraseña actual del colaborador. Solo debes ingresar texto cuando necesites restablecerle la clave por olvido.",
	},
	{
		q: "¿Pueden dos usuarios compartir la misma dirección de correo electrónico?",
		a: "No. El correo electrónico corporativo y el nombre de usuario actúan como identificadores únicos en el sistema. Si intentas registrar un correo duplicado, el formulario te alertará de inmediato.",
	},
];
</script>

<svelte:head>
	<title>Usuarios · Centro de Ayuda</title>
</svelte:head>

<header
	class="flex flex-col gap-1 border-b border-zinc-200 pb-6 dark:border-zinc-800"
>
	<h1
		class="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl dark:text-zinc-100"
	>
		Usuarios
	</h1>
	<p
		class="text-sm leading-relaxed font-normal text-zinc-500 md:text-base dark:text-zinc-400"
	>
		Gestión de colaboradores, alta, edición, control de estado activo/inactivo y
		preguntas frecuentes.
	</p>
</header>

<article class="flex flex-col gap-10">
	<!-- 1. Listar Usuarios y Cambio de Estado -->
	<section id="listar-estados" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				1. Listar Usuarios y Cambio de Estado
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				La tabla principal de usuarios permite consultar a todo el personal
				registrado y controlar en vivo su acceso al sistema mediante el
				interruptor de estado:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
				>
					<ToggleRight size={20} />
				</span>
				<div>
					<h4
						class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
					>
						Control de Estado (Activo / Inactivo)
					</h4>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						Suspensión y Reactivación en Tiempo Real
					</span>
				</div>
			</div>

			<p
				class="m-0 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400"
			>
				En la columna <strong>Estado</strong> de cada colaborador encontrarás un
				interruptor deslizante para gestionar su acceso de forma inmediata:
			</p>

			<ol
				class="m-0 flex list-decimal flex-col gap-2.5 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					<strong>Localizar usuario:</strong>
					Ubica la fila del colaborador en la tabla.
				</li>
				<li>
					<strong>Cambiar estado:</strong>
					Haz clic directamente sobre el interruptor
					<span
						class="inline-flex items-center rounded-full border border-zinc-300 bg-emerald-600 p-0.5 align-middle dark:border-zinc-700 dark:bg-emerald-500"
					>
						<span class="size-3.5 rounded-full bg-white shadow-xs"></span>
					</span>
					en la columna <strong>Estado</strong>.
				</li>
				<li>
					<strong>Suspensión en vivo (Inactivo):</strong>
					Al cambiar el estado a
					<em>Inactivo</em>, el sistema cancela y expulsa inmediatamente todas
					las sesiones activas que el usuario tenga abiertas en cualquier
					dispositivo, impidiéndole volver a iniciar sesión.
				</li>
				<li>
					<strong>Reactivación inmediata (Activo):</strong>
					Para devolverle el acceso al personal reincorporado, vuelve a pulsar
					el interruptor a
					<em>Activo</em>. Sus credenciales funcionarán de nuevo sin necesidad
					de reconfigurarlas.
				</li>
				<li>
					<strong>Protección de auto-bloqueo:</strong>
					Por seguridad, el interruptor se encuentra deshabilitado en tu propia
					fila de usuario para evitar que desactives accidentalmente tu propia
					cuenta administrativa.
				</li>
			</ol>
		</div>
	</section>

	<!-- 2. Crear Nuevo Usuario -->
	<section id="crear-usuario" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				2. Registrar un Nuevo Colaborador
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Procedimiento para dar de alta a un nuevo integrante del equipo en la
				plataforma:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400"
				>
					<UserPlus size={20} />
				</span>
				<div>
					<h4
						class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
					>
						Formulario de Alta de Usuario
					</h4>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						Campos obligatorios y asignación de perfil
					</span>
				</div>
			</div>

			<ol
				class="m-0 flex list-decimal flex-col gap-2.5 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					Haz clic en el botón
					<span
						class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-0.5 align-middle text-xs font-bold text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<UserPlus size={13} />
						Nuevo Usuario
					</span>
					ubicado en la cabecera superior derecha.
				</li>
				<li>
					Completa el <strong>Nombre Completo</strong> del colaborador (ej.
					"Juan Pérez").
				</li>
				<li>
					Define un <strong>Nombre de Usuario</strong> único para su inicio de
					sesión (ej. "jperez").
				</li>
				<li>
					Ingresa su <strong>Correo Electrónico Corporativo</strong>. Debe ser
					único en el sistema.
				</li>
				<li>
					Selecciona el <strong>Rol</strong> adecuado:
					<ul class="mt-1 flex list-disc flex-col gap-1 pl-4">
						<li>
							<strong>Administrador:</strong>
							Acceso completo a todos los módulos y gestión de usuarios.
						</li>
						<li>
							<strong>Usuario:</strong>
							Acceso operativo a las funciones estándar de su área de trabajo.
						</li>
					</ul>
				</li>
				<li>
					Asigna una <strong>Contraseña Inicial</strong> segura (mínimo 8
					caracteres).
				</li>
				<li>
					Presiona <strong>"Crear Usuario"</strong>. Por defecto, todo usuario
					nuevo se registra en estado <strong>Activo</strong> listo para operar.
				</li>
			</ol>
		</div>
	</section>

	<!-- 3. Editar Usuario y Resetear Claves -->
	<section id="editar-usuario" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				3. Modificar Datos y Resetear Contraseñas
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Instrucciones para corregir información del colaborador o asistir en la
				recuperación de acceso:
			</p>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-800/40"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-400"
				>
					<KeyRound size={20} />
				</span>
				<div>
					<h4
						class="m-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100"
					>
						Actualización de Perfil y Claves
					</h4>
					<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						Edición de datos y blanqueo de contraseñas olvidadas
					</span>
				</div>
			</div>

			<ol
				class="m-0 flex list-decimal flex-col gap-2.5 pl-4 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300"
			>
				<li>
					En la tabla de usuarios, haz clic en el botón de edición
					<span
						class="inline-flex size-6 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 align-middle text-zinc-600 shadow-2xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
						title="Editar usuario"
					>
						<Pencil size={13} />
					</span>
					en la fila del colaborador deseado.
				</li>
				<li>
					<strong>Modificar datos personales:</strong>
					Puedes corregir el nombre, nombre de usuario, correo electrónico o
					cambiar el rol asignado.
				</li>
				<li>
					<strong>Resetear contraseña olvidada:</strong>
					Si el colaborador no recuerda su contraseña, escribe una nueva clave
					en el campo
					<em>"Nueva Contraseña"</em>.
				</li>
				<li>
					<strong>Conservar contraseña actual:</strong>
					Si solo deseas cambiar el nombre, correo o rol, deja el campo
					<em>"Nueva Contraseña"</em>
					completamente en blanco; su clave anterior continuará funcionando sin
					cambios.
				</li>
				<li>
					<strong>Reglas de auto-protección:</strong>
					Cuando edites tu propio usuario, el sistema protegerá tu rol y tu
					estado activo para evitar auto-bloqueos.
				</li>
				<li>
					Haz clic en <strong>"Guardar Cambios"</strong> para actualizar el
					registro en tiempo real.
				</li>
			</ol>
		</div>
	</section>

	<!-- 4. Preguntas Frecuentes de Usuarios -->
	<section id="faqs" class="flex scroll-mt-6 flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<h3
				class="m-0 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100"
			>
				Preguntas Frecuentes sobre Usuarios
			</h3>
			<p class="m-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
				Respuestas a las situaciones más comunes durante la administración de
				cuentas de colaboradores:
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
