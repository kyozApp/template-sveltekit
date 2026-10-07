<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { LoaderCircle, Trash } from "@lucide/svelte";

import { deleteUser } from "#lib/remote/user/user.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface Props {
	userId: string;
	userName: string;
}

let { userId, userName }: Props = $props();

let isSubmitting = $state(false);

const handleDelete = async () => {
	if (isSubmitting) return;

	const confirmed = await notifications.showConfirmAlert(
		"Eliminar Usuario",
		`¿Estás seguro de que deseas dar de baja a "${userName}"? El usuario será eliminado del sistema y sus sesiones serán canceladas.`,
	);

	if (!confirmed) return;

	isSubmitting = true;
	try {
		await deleteUser({ id: userId });
		notifications.showToastSuccess(
			`Usuario "${userName}" eliminado con éxito.`,
		);
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[USER DELETE][HTTP ERROR]", e);
			notifications.showToastError(
				e.body?.message ||
					"No se pudo eliminar al usuario. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[USER DELETE][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	} finally {
		isSubmitting = false;
	}
};
</script>

<button
	type="button"
	class="btn-delete-user"
	onclick={handleDelete}
	disabled={isSubmitting}
	data-tooltip="Eliminar usuario"
	data-tooltip-position="top-end"
	aria-label={`Eliminar usuario ${userName}`}
>
	{#if isSubmitting}
		<LoaderCircle size={16} class="spinner" />
	{:else}
		<Trash size={16} />
	{/if}
</button>

<style>
.btn-delete-user {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	inline-size: 32px;
	block-size: 32px;
	padding: 0;

	color: light-dark(oklch(55% 0.18 25), oklch(75% 0.15 25));
	cursor: pointer;

	background-color: transparent;
	border: 1px solid transparent;
	border-radius: 8px;

	transition:
		background-color 0.18s ease,
		border-color 0.18s ease,
		color 0.18s ease;

	&:hover:not(:disabled) {
		background-color: light-dark(oklch(95% 0.025 25), oklch(28% 0.04 25));
		border-color: light-dark(oklch(88% 0.05 25), oklch(38% 0.05 25));
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}

.btn-delete-user :global(.spinner) {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
