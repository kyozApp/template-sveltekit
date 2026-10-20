<script lang="ts">
import { resolve } from "$app/paths";

import { LoaderCircle, LogOut, Settings, User } from "@lucide/svelte";

import { ROLE_LABELS } from "#lib/constants.ts";
import { logoutUser } from "#lib/remote/auth/auth.command.remote.ts";

interface Props {
	user: App.AuthenticatedLocals["user"];
}

let { user }: Props = $props();

let isOpen = $state(false);
let isSubmitting = $state(false);
let menuContainer = $state<HTMLDivElement | null>(null);

const isAdmin = $derived(user.role === "ADMIN");

const initials = $derived.by(() => {
	const name = user.name;
	if (!name) return "U";
	return name
		.split(" ")
		.map((part: string) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
});

// Alterna la visibilidad del menú flotante de usuario
const handleToggleMenu = () => {
	isOpen = !isOpen;
};

// Cierra el menú flotante de usuario
const handleCloseMenu = () => {
	isOpen = false;
};

// Ejecuta el cierre de sesión del usuario y redirige a la pantalla de inicio de sesión
const handleLogout = async () => {
	if (isSubmitting) return;
	isSubmitting = true;

	try {
		await logoutUser();
	} catch (e) {
		console.error("[AUTH LOGOUT][CLIENT ERROR]", e);
	} finally {
		window.location.href = "/iniciar-sesion";
	}
};

// Cierre automático al hacer clic afuera o presionar tecla Escape
$effect(() => {
	if (!isOpen) return;

	// Cierra el menú desplegable si se detecta un clic fuera de su contenedor
	const handleClickOutside = (e: MouseEvent) => {
		if (menuContainer && !menuContainer.contains(e.target as Node)) {
			isOpen = false;
		}
	};

	// Cierra el menú desplegable al presionar la tecla Escape
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			isOpen = false;
		}
	};

	document.addEventListener("click", handleClickOutside);
	document.addEventListener("keydown", handleKeyDown);

	return () => {
		document.removeEventListener("click", handleClickOutside);
		document.removeEventListener("keydown", handleKeyDown);
	};
});
</script>

<div class="relative inline-flex" bind:this={menuContainer}>
	<!-- Botón Trigger de Usuario (Avatar Circular Minimalista) -->
	<button
		type="button"
		class={[
			"group inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 transition-all duration-150",
			isOpen
				? "border-zinc-400 dark:border-zinc-600"
				: "hover:border-zinc-400 dark:hover:border-zinc-600",
		]}
		onclick={handleToggleMenu}
		aria-haspopup="menu"
		aria-expanded={isOpen}
		aria-label="Menú de usuario"
	>
		<span
			class={[
				"flex size-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-bold text-zinc-800 transition-all duration-150 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
				isOpen
					? "scale-105 shadow-md"
					: "group-hover:scale-105 group-hover:shadow-md",
			]}
		>
			{initials}
		</span>
	</button>

	<!-- Menú Flotante Dropdown -->
	{#if isOpen}
		<div
			class="absolute top-full right-0 z-50 mt-2.5 flex w-65 origin-top-right flex-col rounded-2xl border border-zinc-200 bg-white shadow-xl transition-all duration-150 dark:border-zinc-800 dark:bg-zinc-900"
			role="menu"
			tabindex="-1"
			aria-label="Opciones del usuario"
		>
			<!-- Tarjeta de Identidad -->
			<div class="flex items-center gap-3 p-4">
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-extrabold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
				>
					{initials}
				</div>
				<div class="flex min-w-0 flex-1 flex-col gap-0.5">
					<span
						class="truncate text-sm font-bold text-zinc-900 dark:text-zinc-50"
					>
						{user.name}
					</span>
					<span class="truncate text-xs text-zinc-500 dark:text-zinc-400">
						{user.email}
					</span>
					<div class="mt-1">
						<span
							class={[
								"inline-flex rounded-full px-2 py-0.5 text-xs font-bold tracking-wider uppercase",
								user.role === "ADMIN"
									? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
									: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
							]}
						>
							{ROLE_LABELS[user.role]}
						</span>
					</div>
				</div>
			</div>

			<div class="h-px bg-zinc-200 dark:bg-zinc-800"></div>

			<!-- Navegación de Perfil y Configuración -->
			<nav class="flex flex-col p-1.5">
				<a
					href={resolve("perfil")}
					class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-700 no-underline transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
					role="menuitem"
					onclick={handleCloseMenu}
				>
					<span class="flex items-center text-zinc-500 dark:text-zinc-400">
						<User size={16} />
					</span>
					<span>Mi Perfil</span>
				</a>

				{#if isAdmin}
					<a
						href={resolve("configuracion")}
						class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-700 no-underline transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
						role="menuitem"
						onclick={handleCloseMenu}
					>
						<span class="flex items-center text-zinc-500 dark:text-zinc-400">
							<Settings size={16} />
						</span>
						<span>Configuración</span>
					</a>
				{/if}
			</nav>

			<div class="h-px bg-zinc-200 dark:bg-zinc-800"></div>

			<!-- Botón de Cerrar Sesión -->
			<div class="p-1.5">
				<button
					type="button"
					class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
					onclick={handleLogout}
					disabled={isSubmitting}
					role="menuitem"
				>
					{#if isSubmitting}
						<LoaderCircle size={16} class="animate-spin" />
						<span>Cerrando sesión...</span>
					{:else}
						<LogOut size={16} />
						<span>Cerrar sesión</span>
					{/if}
				</button>
			</div>
		</div>
	{/if}
</div>
