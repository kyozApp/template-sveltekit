<script lang="ts">
import { untrack } from "svelte";
import { page } from "$app/state";

import AppHeader from "#lib/components/layout/AppHeader.svelte";
import AppProgressBar from "#lib/components/layout/AppProgressBar.svelte";
import AppSidebar from "#lib/components/layout/AppSidebar.svelte";
import { checkUserAuth } from "#lib/remote/auth/auth.query.remote";
import { notifications } from "#lib/services/notifications.svelte";

let { children } = $props();

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

<div class="app-layout">
	<AppProgressBar />

	<AppSidebar bind:isSidebarOpen />

	<!-- ─── CONTENEDOR PRINCIPAL DERECHO ───────────────────────────────── -->
	<div class="main-container">
		<AppHeader bind:isSidebarOpen />

		<!-- Área de contenido principal -->
		<main class="app-content">
			{@render children()}
		</main>
	</div>
</div>

<style>
/* ── Layout principal ──────────────────────────── */
.app-layout {
	display: flex;

	width: 100%;
	min-height: 100dvh;
	overflow-x: hidden;

	color: light-dark(
		oklch(20.239% 0.01855 255.762 / 0.829),
		oklch(98% 0.01 255)
	);

	background-color: light-dark(oklch(98% 0.01 255), oklch(18% 0.03 255));
}

/* ── Contenedor Derecho ────────────────────────── */
.main-container {
	display: flex;
	flex: 1;
	flex-direction: column;

	min-width: 0;
	height: 100dvh;
}

/* ── Contenido Principal ──────────────────────── */
.app-content {
	display: flex;
	flex: 1;
	flex-direction: column;

	padding: 2.25rem;
	overflow-y: auto;

	background-color: light-dark(oklch(98% 0.01 255), oklch(18% 0.03 255));

	@media (width <= 768px) {
		padding: 1.5rem;
	}
}
</style>
