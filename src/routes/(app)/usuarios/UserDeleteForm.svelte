<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { LoaderCircle, Trash, TriangleAlert } from "@lucide/svelte";

import { deleteUser } from "#lib/remote/user/user.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface Props {
	userId: string;
	userName: string;
	onClose: () => void;
}

let { userId, userName, onClose }: Props = $props();

let isSubmitting = $state(false);

/** Elimina el usuario y revoca sus sesiones activas. */
const handleDelete = async () => {
	if (isSubmitting) return;
	isSubmitting = true;

	try {
		await deleteUser({ id: userId });
		notifications.showToastSuccess(
			`Usuario "${userName}" eliminado con éxito.`,
		);
		onClose();
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[USER DELETE][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos eliminar el usuario en este momento. Por favor, comuníquese con sistemas.",
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

<div
	class="min-h-0 flex-1 overflow-auto overscroll-contain bg-zinc-50 px-5 py-5 sm:px-8 sm:py-6 dark:bg-zinc-950"
>
	<div class="flex flex-col gap-5">
		<!-- Advertencia de baja permanente -->
		<div
			class="flex items-start gap-3 rounded-xl border border-red-300/40 bg-red-500/10 p-4 dark:border-red-900/50"
		>
			<TriangleAlert
				size={18}
				class="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
			/>
			<p
				class="text-sm leading-relaxed font-medium text-red-700 dark:text-red-300"
			>
				¿Estás seguro de que deseas dar de baja a "{userName}"? El usuario será
				eliminado del sistema y sus sesiones serán canceladas.
			</p>
		</div>

		<!-- Botones de acción -->
		<div class="flex flex-wrap items-center justify-end gap-3 pt-2">
			<button
				type="button"
				class="flex min-w-40 flex-1 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-all duration-200 hover:not-disabled:bg-zinc-100 hover:not-disabled:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-initial dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:not-disabled:bg-zinc-800 dark:hover:not-disabled:text-zinc-100"
				onclick={onClose}
				disabled={isSubmitting}
			>
				<span>Cancelar</span>
			</button>

			<button
				type="button"
				class="flex min-w-44 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-700 bg-red-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:not-disabled:border-red-800 hover:not-disabled:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-initial"
				onclick={handleDelete}
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<LoaderCircle size={18} class="animate-spin" />
					<span>Eliminando...</span>
				{:else}
					<Trash size={18} />
					<span>Eliminar Usuario</span>
				{/if}
			</button>
		</div>
	</div>
</div>
