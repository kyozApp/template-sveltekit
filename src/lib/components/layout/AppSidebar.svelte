<script lang="ts">
import { fly } from "svelte/transition";
import { resolve } from "$app/paths";
import { page } from "$app/state";

import { BookOpen, Layers, LayoutDashboard, UserCog, X } from "@lucide/svelte";

interface Props {
	isSidebarOpen: boolean;
	user: App.AuthenticatedLocals["user"];
}

let { isSidebarOpen = $bindable(), user }: Props = $props();

// Cierra el menú lateral en dispositivos móviles
const handleCloseSidebar = () => {
	isSidebarOpen = false;
};
</script>

{#if isSidebarOpen}
	<button
		type="button"
		class="fixed inset-0 z-35 cursor-pointer border-none bg-black/40 backdrop-blur-xs transition-opacity duration-200 md:hidden dark:bg-black/60"
		onclick={handleCloseSidebar}
		tabindex="-1"
		aria-hidden="true"
	></button>
{/if}

<aside
	class={[
		"fixed top-0 left-0 z-40 flex h-dvh shrink-0 flex-col border-r border-zinc-200 bg-white transition-all duration-250 ease-in-out md:sticky md:z-35 dark:border-zinc-800 dark:bg-zinc-900",
		isSidebarOpen
			? "w-65 translate-x-0"
			: "-translate-x-full md:w-20 md:translate-x-0",
	]}
>
	<div
		class={[
			"flex h-17.5 shrink-0 items-center border-b border-zinc-200 px-6 dark:border-zinc-800",
			isSidebarOpen ? "justify-between" : "justify-center md:px-0",
		]}
	>
		<a
			href={resolve("dashboard")}
			class="flex items-center gap-3 no-underline"
			aria-label="Ir al panel principal"
			in:fly={{ y: 4, duration: 300 }}
		>
			<span
				class="flex items-center justify-center text-blue-600 dark:text-blue-400"
			>
				<Layers size={24} />
			</span>
			{#if isSidebarOpen}
				<span
					class="bg-linear-to-br from-zinc-900 to-zinc-500 bg-clip-text text-base font-extrabold tracking-wider whitespace-nowrap text-transparent dark:from-zinc-100 dark:to-zinc-400"
				>
					ADMIN PANEL
				</span>
			{/if}
		</a>

		{#if isSidebarOpen}
			<button
				type="button"
				class="flex size-9 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-zinc-500 transition-colors duration-150 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
				onclick={handleCloseSidebar}
				aria-label="Cerrar menú"
			>
				<X size={20} />
			</button>
		{/if}
	</div>

	{#if isSidebarOpen}
		<div
			class="px-6 pt-6 pb-2 text-xs font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500"
			in:fly={{ y: 4, duration: 300 }}
		>
			MENÚ PRINCIPAL
		</div>
	{/if}

	<nav class="flex flex-col gap-1.5 p-3">
		<a
			href={resolve("dashboard")}
			class={[
				"group relative flex items-center gap-3.5 rounded-xl text-sm font-semibold no-underline transition-colors duration-150",
				isSidebarOpen ? "px-4 py-3" : "justify-center py-3 md:px-0",
				page.url.pathname.startsWith("/dashboard")
					? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
					: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
			]}
			data-tooltip={!isSidebarOpen ? "Dashboard" : undefined}
			data-tooltip-position="right"
			aria-label="Dashboard"
		>
			<span class="flex shrink-0 items-center justify-center">
				<LayoutDashboard size={18} />
			</span>
			{#if isSidebarOpen}
				<span class="whitespace-nowrap">Dashboard</span>
			{/if}
		</a>

		{#if user.role === "ADMIN"}
			<a
				href={resolve("usuarios")}
				class={[
					"group relative flex items-center gap-3.5 rounded-xl text-sm font-semibold no-underline transition-colors duration-150",
					isSidebarOpen ? "px-4 py-3" : "justify-center py-3 md:px-0",
					page.url.pathname.startsWith("/usuarios")
						? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
						: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
				]}
				data-tooltip={!isSidebarOpen ? "Usuarios" : undefined}
				data-tooltip-position="right"
				aria-label="Usuarios"
			>
				<span class="flex shrink-0 items-center justify-center">
					<UserCog size={18} />
				</span>
				{#if isSidebarOpen}
					<span class="whitespace-nowrap">Usuarios</span>
				{/if}
			</a>
		{/if}

		<a
			href={resolve("manual")}
			class={[
				"group relative flex items-center gap-3.5 rounded-xl text-sm font-semibold no-underline transition-colors duration-150",
				isSidebarOpen ? "px-4 py-3" : "justify-center py-3 md:px-0",
				page.url.pathname.startsWith("/manual")
					? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
					: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
			]}
			data-tooltip={!isSidebarOpen ? "Centro de Ayuda" : undefined}
			data-tooltip-position="right"
			aria-label="Centro de Ayuda"
		>
			<span class="flex shrink-0 items-center justify-center">
				<BookOpen size={18} />
			</span>
			{#if isSidebarOpen}
				<span class="whitespace-nowrap">Centro de Ayuda</span>
			{/if}
		</a>
	</nav>
</aside>
