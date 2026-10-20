<script lang="ts">
import { untrack } from "svelte";
import { navigating, page } from "$app/state";

import AppHeader from "#lib/components/layout/AppHeader.svelte";
import AppSidebar from "#lib/components/layout/AppSidebar.svelte";
import { checkUserAuth } from "#lib/remote/auth/auth.query.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

import type { LayoutProps } from "./$types";

let { data, children }: LayoutProps = $props();

let isSidebarOpen = $state(true);

// Monitoreo pasivo de la sesión en segundo plano (Vanguardia Svelte 5)
$effect(() => {
	let isRedirecting = false;
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	const handleLogout = (message: string) => {
		if (isRedirecting) return;
		isRedirecting = true;

		notifications.showToastWarning(message, 5000);

		// Redireccionar limpiamente a la pantalla de login
		setTimeout(() => {
			window.location.href = "/iniciar-sesion";
		}, 2500);
	};

	// Polling pasivo cada 60 segundos para comprobar validez de sesión en BD
	const checkSessionStatus = async () => {
		try {
			const result = await checkUserAuth();

			// Si no está autenticado, la sesión ya no existe
			if (!result.authenticated) {
				handleLogout(
					"Tu sesión diaria ha expirado o fue cerrada desde otro dispositivo.",
				);
			}
		} catch (e) {
			// Tolerancia offline: Ignoramos fallos temporales de conexión
			console.warn(
				"[SESSION WATCHDOG]: Error temporal de conexión al validar sesión.",
				e,
			);
		}
	};

	const startPolling = () => {
		if (!pollInterval) {
			pollInterval = setInterval(checkSessionStatus, 60000);
		}
	};

	const stopPolling = () => {
		if (pollInterval) {
			clearInterval(pollInterval);
			pollInterval = null;
		}
	};

	const handleVisibilityChange = () => {
		if (document.visibilityState === "visible") {
			// Comprobar inmediatamente al volver a la pestaña
			checkSessionStatus();
			startPolling();
		} else {
			// Detener el intervalo si la pestaña no está activa
			stopPolling();
		}
	};

	document.addEventListener("visibilitychange", handleVisibilityChange);

	// Inicialización inmediata si el documento es visible
	if (document.visibilityState === "visible") {
		checkSessionStatus();
		startPolling();
	}

	return () => {
		stopPolling();
		document.removeEventListener("visibilitychange", handleVisibilityChange);
	};
});

// Control de responsividad del sidebar en móviles/tablets
$effect(() => {
	// Registrar dependencia de pathname para ejecutar en cada navegación
	if (page.url.pathname) {
		untrack(() => {
			// Inicializar cerrado si es un dispositivo móvil o cerrar al navegar
			if (window.innerWidth <= 768) {
				isSidebarOpen = false;
			}
		});
	}
});
</script>

<div
	class="flex min-h-dvh w-full overflow-x-hidden bg-zinc-50 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
>
	{#if navigating.to}
		<div
			class="fixed top-0 left-0 z-50 h-0.5 w-full bg-zinc-300 dark:bg-zinc-700"
		>
			<div
				class="h-full w-full origin-left animate-pulse bg-zinc-900 dark:bg-zinc-100"
			></div>
		</div>
	{/if}

	<AppSidebar bind:isSidebarOpen user={data.user} />

	<!-- ─── CONTENEDOR PRINCIPAL DERECHO ────────────────────────── -->
	<div class="flex h-dvh min-w-0 flex-1 flex-col">
		<AppHeader bind:isSidebarOpen user={data.user} />

		<!-- Área de contenido principal -->
		<main
			class="flex flex-1 flex-col overflow-y-auto scroll-smooth bg-zinc-50 p-6 md:p-9 dark:bg-zinc-950"
		>
			{@render children()}
		</main>
	</div>
</div>
