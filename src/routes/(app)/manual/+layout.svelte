<script lang="ts">
import { fly } from "svelte/transition";
import { resolve } from "$app/paths";
import { page } from "$app/state";

import { BookOpen, Layers, SlidersVertical, UserCog } from "@lucide/svelte";

let { data, children } = $props();

const user = $derived(data.user);
const isAdmin = $derived(user.role === "ADMIN");
</script>

<div
	class="flex w-full flex-col gap-6 text-zinc-900 dark:text-zinc-100"
	in:fly={{ y: 8, duration: 350 }}
>
	<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
		<!-- Menú Lateral / Índice del Manual -->
		<aside
			id="temario-manual"
			class="flex w-full flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:w-72 lg:min-w-72 lg:overflow-y-auto dark:border-zinc-800 dark:bg-zinc-900"
			aria-label="Temario del manual"
		>
			<div
				class="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800"
			>
				<div
					class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
				>
					<BookOpen size={18} />
				</div>
				<span
					class="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
				>
					Índice del Manual
				</span>
			</div>

			<nav class="flex flex-col gap-2">
				<!-- Módulo 1: Plantilla -->
				<div class="flex flex-col gap-1">
					<a
						href={resolve("manual/plantilla")}
						class={[
							"relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold no-underline transition-all duration-150",
							page.url.pathname === "/manual/plantilla"
								? "bg-zinc-100 font-bold text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
								: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
						]}
					>
						{#if page.url.pathname === "/manual/plantilla"}
							<span
								class="absolute inset-y-2 left-0 w-1 rounded-r-full bg-zinc-900 dark:bg-zinc-100"
							></span>
						{/if}
						<span
							class={[
								"flex shrink-0 items-center justify-center transition-colors duration-150",
								page.url.pathname === "/manual/plantilla"
									? "text-zinc-900 dark:text-zinc-100"
									: "text-zinc-400 dark:text-zinc-500",
							]}
						>
							<Layers size={16} />
						</span>
						<span class="flex-1 truncate">Plantilla</span>
					</a>

					{#if page.url.pathname === "/manual/plantilla"}
						<div
							class="ml-5 flex flex-col gap-0.5 border-l-2 border-zinc-200 py-1 pl-3 dark:border-zinc-800"
						>
							<a
								href="#vision-general"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Visión General
							</a>
							<a
								href="#arquitectura"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Arquitectura y Stack
							</a>
							<a
								href="#estructura"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Estructura del Proyecto
							</a>
							<a
								href="#faqs"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Preguntas Frecuentes
							</a>
						</div>
					{/if}
				</div>

				<!-- Módulo 2: Interfaz y Cuenta -->
				<div class="flex flex-col gap-1">
					<a
						href={resolve("manual/interfaz")}
						class={[
							"relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold no-underline transition-all duration-150",
							page.url.pathname === "/manual/interfaz"
								? "bg-zinc-100 font-bold text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
								: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
						]}
					>
						{#if page.url.pathname === "/manual/interfaz"}
							<span
								class="absolute inset-y-2 left-0 w-1 rounded-r-full bg-zinc-900 dark:bg-zinc-100"
							></span>
						{/if}
						<span
							class={[
								"flex shrink-0 items-center justify-center transition-colors duration-150",
								page.url.pathname === "/manual/interfaz"
									? "text-zinc-900 dark:text-zinc-100"
									: "text-zinc-400 dark:text-zinc-500",
							]}
						>
							<SlidersVertical size={16} />
						</span>
						<span class="flex-1 truncate">Interfaz y Cuenta</span>
					</a>

					{#if page.url.pathname === "/manual/interfaz"}
						<div
							class="ml-5 flex flex-col gap-0.5 border-l-2 border-zinc-200 py-1 pl-3 dark:border-zinc-800"
						>
							<a
								href="#modo-color"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Modo Claro y Oscuro
							</a>
							<a
								href="#menu-perfil"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Menú de Perfil
							</a>
							<a
								href="#cierre-sesion"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Cierre de Sesión
							</a>
							<a
								href="#barra-lateral"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Barra Lateral
							</a>
							<a
								href="#faqs"
								class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
							>
								Preguntas Frecuentes
							</a>
						</div>
					{/if}
				</div>

				<!-- Módulo 3: Usuarios (Solo Administradores) -->
				{#if isAdmin}
					<div class="flex flex-col gap-1">
						<a
							href={resolve("manual/usuarios")}
							class={[
								"relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold no-underline transition-all duration-150",
								page.url.pathname === "/manual/usuarios"
									? "bg-zinc-100 font-bold text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
									: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
							]}
						>
							{#if page.url.pathname === "/manual/usuarios"}
								<span
									class="absolute inset-y-2 left-0 w-1 rounded-r-full bg-zinc-900 dark:bg-zinc-100"
								></span>
							{/if}
							<span
								class={[
									"flex shrink-0 items-center justify-center transition-colors duration-150",
									page.url.pathname === "/manual/usuarios"
										? "text-zinc-900 dark:text-zinc-100"
										: "text-zinc-400 dark:text-zinc-500",
								]}
							>
								<UserCog size={16} />
							</span>
							<span class="flex-1 truncate">Usuarios</span>
						</a>

						{#if page.url.pathname === "/manual/usuarios"}
							<div
								class="ml-5 flex flex-col gap-0.5 border-l-2 border-zinc-200 py-1 pl-3 dark:border-zinc-800"
							>
								<a
									href="#listar-estados"
									class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
								>
									Listar Usuarios
								</a>
								<a
									href="#crear-usuario"
									class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
								>
									Crear Usuarios
								</a>
								<a
									href="#editar-usuario"
									class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
								>
									Editar Usuarios
								</a>
								<a
									href="#faqs"
									class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
								>
									Preguntas Frecuentes
								</a>
							</div>
						{/if}
					</div>
				{/if}
			</nav>
		</aside>

		<!-- Contenido de la página activa -->
		<main
			class="flex min-w-0 flex-1 flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs sm:p-6 md:p-8 dark:border-zinc-800 dark:bg-zinc-900"
			aria-label="Contenido del manual"
		>
			{@render children()}
		</main>
	</div>

	<!-- Botón flotante para móvil: Volver al Índice -->
	<div class="fixed right-5 bottom-6 z-20 lg:hidden">
		<button
			type="button"
			onclick={() => {
				const el = document.getElementById("temario-manual");
				el?.scrollIntoView({ behavior: "smooth" });
			}}
			class="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-4 py-2.5 text-xs font-bold text-zinc-800 shadow-lg backdrop-blur-sm transition-all duration-150 hover:bg-zinc-100 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800/95 dark:text-zinc-100 dark:hover:bg-zinc-700"
			aria-label="Volver al temario del manual"
		>
			<BookOpen size={16} />
			<span>Índice</span>
		</button>
	</div>
</div>
