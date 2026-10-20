<script lang="ts">
import { fly } from "svelte/transition";
import { resolve } from "$app/paths";

import {
	Activity,
	BookOpen,
	ShieldCheck,
	UserCheck,
	Users,
} from "@lucide/svelte";

import { ROLE_LABELS } from "#lib/constants.ts";

let { data } = $props();

const user = $derived(data.user);
</script>

<svelte:head>
	<title>Dashboard · Admin Panel</title>
</svelte:head>

<div
	class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-6 pb-12 text-zinc-900 md:gap-8 md:px-5 md:py-6 md:pb-12 dark:text-zinc-100"
	in:fly={{ y: 8, duration: 350 }}
>
	<header
		class="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800"
	>
		<div class="flex flex-col gap-1">
			<h1
				class="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50"
			>
				¡Bienvenido, {user.name}!
			</h1>
			<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
				Panel de control y resumen general del sistema
			</p>
		</div>

		<div
			class={[
				"inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase",
				user.role === "ADMIN"
					? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
					: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
			]}
		>
			<ShieldCheck size={16} />
			<span>Rol: {ROLE_LABELS[user.role]}</span>
		</div>
	</header>

	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Tarjeta: Gestión de Usuarios -->
		<div
			class="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div
				class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
			>
				<Users size={22} />
			</div>
			<div class="flex flex-col gap-1">
				<span
					class="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
				>
					Gestión de Acceso
				</span>
				<span class="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
					Usuarios
				</span>
				<a
					href={resolve("usuarios")}
					class="mt-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
				>
					Administrar cuentas →
				</a>
			</div>
		</div>

		<!-- Tarjeta: Sesión Actual -->
		<div
			class="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div
				class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
			>
				<UserCheck size={22} />
			</div>
			<div class="flex min-w-0 flex-col gap-1">
				<span
					class="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
				>
					Sesión Actual
				</span>
				<span
					class="truncate text-lg font-extrabold text-zinc-900 dark:text-zinc-100"
				>
					{user.username}
				</span>
				<span class="truncate text-xs text-zinc-500 dark:text-zinc-400">
					{user.email}
				</span>
			</div>
		</div>

		<!-- Tarjeta: Estado del Servidor -->
		<div
			class="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div
				class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-900 dark:bg-purple-950/60 dark:text-purple-300"
			>
				<Activity size={22} />
			</div>
			<div class="flex flex-col gap-1">
				<span
					class="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
				>
					Estado del Servidor
				</span>
				<span class="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
					Operativo
				</span>
				<span class="text-xs text-zinc-500 dark:text-zinc-400">
					Node.js · SvelteKit · Prisma 8
				</span>
			</div>
		</div>

		<!-- Tarjeta: Documentación -->
		<div
			class="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
		>
			<div
				class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
			>
				<BookOpen size={22} />
			</div>
			<div class="flex flex-col gap-1">
				<span
					class="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
				>
					Documentación
				</span>
				<span class="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
					Manual
				</span>
				<a
					href={resolve("manual")}
					class="mt-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
				>
					Consultar guía →
				</a>
			</div>
		</div>
	</div>
</div>
