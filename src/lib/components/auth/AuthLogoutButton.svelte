<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { LoaderCircle, LogOut } from "@lucide/svelte";

import { logoutUser } from "#lib/remote/auth/auth.command.remote";
import { notifications } from "#lib/services/notifications.svelte";

let isSubmitting = $state(false);
</script>

<button
	type="button"
	onclick={async () => {
		if (isSubmitting) return;
		isSubmitting = true;

		try {
			await logoutUser();
			window.location.href = "/iniciar-sesion";
		} catch (e) {
			if (isHttpError(e)) {
				console.error("[AUTH LOGOUT][HTTP ERROR]", e);
				notifications.showToastError(
					"No pudimos cerrar la sesión en este momento. Por favor, comuníquese con sistemas.",
				);
			} else {
				console.error("[AUTH LOGOUT][CONNECTION ERROR]", e);
				notifications.showToastError(
					"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
				);
			}
		} finally {
			isSubmitting = false;
		}
	}}
	class="btn-logout"
	disabled={isSubmitting}
	aria-label="Cerrar sesión"
>
	{#if isSubmitting}
		<LoaderCircle size="15" class="spinner" />
	{:else}
		<LogOut size="15" />
	{/if}
	<span>Salir</span>
</button>

<style>
.btn-logout {
	cursor: pointer;

	display: inline-flex;
	gap: 0.45rem;
	align-items: center;
	justify-content: center;

	padding: 0.55rem 0.95rem;
	border: 1px solid light-dark(oklch(89% 0.008 248), oklch(27% 0.015 260));
	border-radius: 12px;

	font-size: 0.84rem;
	font-weight: 650;
	color: light-dark(oklch(45% 0.12 25), oklch(75% 0.1 25));
	letter-spacing: 0.01em;

	background-color: light-dark(
		oklch(97.5% 0.006 25),
		oklch(27.5% 0.032 256.86)
	);

	transition:
		color 0.18s ease,
		border-color 0.18s ease,
		background-color 0.18s ease;

	-webkit-tap-highlight-color: transparent;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	&:hover:not(:disabled) {
		color: light-dark(oklch(38% 0.16 25), oklch(88% 0.1 25));

		background-color: light-dark(oklch(94% 0.02 25), oklch(32% 0.04 25));
		border-color: light-dark(oklch(80% 0.06 25), oklch(42% 0.05 25));
	}
}

.btn-logout :global(.spinner) {
	animation: spin-1s-logout 1s linear infinite;
}

@keyframes spin-1s-logout {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
