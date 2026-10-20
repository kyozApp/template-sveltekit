<script lang="ts">
import { fly } from "svelte/transition";

import {
	Activity,
	Clock,
	Cpu,
	Database,
	Layers,
	Lock,
	Server,
	Settings,
	ShieldCheck,
} from "@lucide/svelte";

let activeTab = $state<"general" | "security" | "system">("general");

// Cambia la pestaña activa de la configuración del sistema
const handleSelectTab = (tab: "general" | "security" | "system") => {
	activeTab = tab;
};
</script>

<svelte:head>
	<title>Configuración</title>
</svelte:head>

<div
	class="mx-auto flex w-full max-w-5xl flex-col gap-5 px-3 py-6 pb-12 text-zinc-900 md:gap-7 md:px-5 md:py-6 md:pb-12 dark:text-zinc-100"
	in:fly={{ y: 8, duration: 350 }}
>
	<!-- Encabezado de la Sección -->
	<header
		class="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:gap-5 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900"
	>
		<div
			class="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
		>
			<Settings size={28} />
		</div>
		<div class="flex flex-col gap-1">
			<h1
				class="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
			>
				Configuración del Sistema
			</h1>
			<p class="text-xs text-zinc-500 dark:text-zinc-400">
				Parámetros globales, políticas de seguridad y monitoreo operacional de
				la plataforma.
			</p>
		</div>
	</header>

	<!-- Barra de Navegación por Pestañas -->
	<div
		class="flex gap-2 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-100 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60"
	>
		<button
			type="button"
			class={[
				"inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
				activeTab === "general"
					? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400"
					: "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
			]}
			onclick={() => handleSelectTab("general")}
		>
			<Layers size={16} />
			<span>Parámetros Generales</span>
		</button>
		<button
			type="button"
			class={[
				"inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
				activeTab === "security"
					? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400"
					: "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
			]}
			onclick={() => handleSelectTab("security")}
		>
			<Lock size={16} />
			<span>Políticas de Seguridad</span>
		</button>
		<button
			type="button"
			class={[
				"inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
				activeTab === "system"
					? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400"
					: "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
			]}
			onclick={() => handleSelectTab("system")}
		>
			<Server size={16} />
			<span>Infraestructura y Worker</span>
		</button>
	</div>

	<!-- Contenido de la pestaña activa -->
	<main class="flex flex-col">
		{#if activeTab === "general"}
			<div
				class="grid grid-cols-1 gap-5 md:grid-cols-2"
				in:fly={{ y: 6, duration: 250 }}
			>
				<div
					class="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Layers size={20} />
					</div>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
							Identidad del Sistema
						</h3>
						<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
							Nombre y metadatos de la plataforma visibles para usuarios.
						</p>
						<div
							class="mt-2 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 dark:border-zinc-800"
						>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Aplicación:</span
								>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									Template SvelteKit
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Versión de Arquitectura:</span
								>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									SvelteKit 3 / Svelte 5
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Zona Horaria:</span
								>
								<span class="font-semibold text-zinc-900 dark:text-zinc-100">
									America/Lima (UTC-5)
								</span>
							</div>
						</div>
					</div>
				</div>

				<div
					class="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Database size={20} />
					</div>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
							Base de Datos Principal
						</h3>
						<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
							Conexión a base de datos relacional y estado del motor ORM.
						</p>
						<div
							class="mt-2 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 dark:border-zinc-800"
						>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400">Motor:</span>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									PostgreSQL 17+
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Driver ORM:</span
								>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									@prisma/orm-postgres (v8)
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Migraciones:</span
								>
								<span
									class="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold tracking-wide text-emerald-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-300"
								>
									Sincronizado
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === "security"}
			<div
				class="grid grid-cols-1 gap-5 md:grid-cols-2"
				in:fly={{ y: 6, duration: 250 }}
			>
				<div
					class="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<ShieldCheck size={20} />
					</div>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
							Cifrado y Autenticación
						</h3>
						<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
							Estándares criptográficos aplicados a credenciales y sesiones.
						</p>
						<div
							class="mt-2 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 dark:border-zinc-800"
						>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Algoritmo de Hashing:</span
								>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									Argon2id
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Cookies de Sesión:</span
								>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									HttpOnly, SameSite=Lax
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>TTL de Sesión:</span
								>
								<span class="font-semibold text-zinc-900 dark:text-zinc-100">
									24 horas continuas
								</span>
							</div>
						</div>
					</div>
				</div>

				<div
					class="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Activity size={20} />
					</div>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
							Watchdog de Sesión
						</h3>
						<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
							Monitoreo activo para invalidación inmediata de cuentas
							desactivadas.
						</p>
						<div
							class="mt-2 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 dark:border-zinc-800"
						>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Frecuencia de Polling:</span
								>
								<span class="font-semibold text-zinc-900 dark:text-zinc-100">
									Cada 60 segundos
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Revisión en Foco:</span
								>
								<span
									class="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold tracking-wide text-emerald-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-300"
								>
									Activo (visibilitychange)
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Revocación Automática:</span
								>
								<span
									class="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold tracking-wide text-emerald-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-300"
								>
									Activa
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === "system"}
			<div
				class="grid grid-cols-1 gap-5 md:grid-cols-2"
				in:fly={{ y: 6, duration: 250 }}
			>
				<div
					class="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Cpu size={20} />
					</div>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
							Worker SSR y Tareas en Segundo Plano
						</h3>
						<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
							Proceso independiente para limpieza de datos y cron jobs.
						</p>
						<div
							class="mt-2 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 dark:border-zinc-800"
						>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400">Proceso:</span>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									build/worker.js
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Limpieza de Sesiones:</span
								>
								<span class="font-semibold text-zinc-900 dark:text-zinc-100">
									Diario a las 03:00 AM
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Estado de Ejecución:</span
								>
								<span
									class="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold tracking-wide text-emerald-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-300"
								>
									En Ejecución
								</span>
							</div>
						</div>
					</div>
				</div>

				<div
					class="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Clock size={20} />
					</div>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
							Control de Tablas Maestras
						</h3>
						<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
							Punto de extensión para futuros catálogos del negocio.
						</p>
						<div
							class="mt-2 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 dark:border-zinc-800"
						>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Estructura Modular:</span
								>
								<span class="font-semibold text-zinc-900 dark:text-zinc-100">
									Pestañas dinámicas
								</span>
							</div>
							<div class="flex items-center justify-between text-xs">
								<span class="text-zinc-500 dark:text-zinc-400"
									>Nivel de Acceso:</span
								>
								<span
									class="font-mono font-semibold text-zinc-900 dark:text-zinc-100"
								>
									ADMIN
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
