<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { toggleUserStatus } from "#lib/remote/user/user.command.remote";
import { notifications } from "#lib/services/notifications.svelte";

interface Props {
	userId: string;
	isActive: boolean;
}

let { userId, isActive }: Props = $props();

let isSubmitting = $state(false);
</script>

<button
	type="button"
	onclick={async () => {
	if (isSubmitting) return;
	isSubmitting = true;

	try {
		await toggleUserStatus({ id: userId, isActive: !isActive });

		notifications.showToastSuccess(
			`Usuario ${!isActive ? "activado" : "desactivado"} con éxito.`,
		);
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[USER TOGGLE STATUS][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos cambiar el estado del usuario en este momento. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[USER TOGGLE STATUS][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	} finally {
		isSubmitting = false;
	}
}}
	role="switch"
	aria-checked={isActive}
	aria-label="Alternar estado del usuario"
	class="toggle-status-btn"
	class:active={isActive}
	disabled={isSubmitting}
>
	<span class="toggle-track"></span>
	<span class="toggle-thumb"></span>
	<span class="sr-only">Estado del usuario</span>
</button>

<style>
.sr-only {
	position: absolute;

	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;

	overflow: hidden;
	border: 0;

	clip-path: rect(0 0 0 0);
}

.toggle-status-btn {
	position: relative;

	inline-size: 54px;
	block-size: 30px;
	padding: 0;
	cursor: pointer;

	background: transparent;
	border: none;
	border-radius: 9999px;

	transition: opacity 0.18s ease;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}
}

.toggle-track {
	position: absolute;
	inset: 0;

	background-color: light-dark(oklch(88% 0.008 245), oklch(27% 0.015 260));

	border-radius: 9999px;
	box-shadow: 0 0 0 1px light-dark(oklch(83% 0.01 245), oklch(38% 0.024 256.86))
		inset;

	transition:
		background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-thumb {
	position: absolute;
	top: 3px;
	left: 3px;

	inline-size: 24px;
	block-size: 24px;

	background-color: light-dark(oklch(99% 0.002 245), oklch(78% 0.008 255));
	border-radius: 50%;
	box-shadow: 0 0 0 1px light-dark(oklch(82% 0.01 245), oklch(60% 0.012 255))
		inset;

	transition:
		background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		inline-size 0.12s ease;
}

.toggle-status-btn.active .toggle-track {
	background-color: light-dark(oklch(60% 0.075 150), oklch(63% 0.072 155));
	box-shadow: 0 0 0 1px light-dark(oklch(60% 0.075 150), oklch(63% 0.072 155))
		inset;
}

.toggle-status-btn.active .toggle-thumb {
	background-color: light-dark(oklch(99% 0.002 245), oklch(23.5% 0.018 255));
	box-shadow: none;
	transform: translateX(24px);
}

.toggle-status-btn:active:not(:disabled) .toggle-thumb {
	inline-size: 28px;
}

.toggle-status-btn.active:active:not(:disabled) .toggle-thumb {
	transform: translateX(20px);
}
</style>
