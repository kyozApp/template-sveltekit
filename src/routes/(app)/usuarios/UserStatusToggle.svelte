<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { toggleUserStatus } from "#lib/remote/user/user.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface Props {
	userId: string;
	isActive: boolean;
}

let { userId, isActive }: Props = $props();

let isSubmitting = $state(false);

/** Alterna el estado activo o inactivo del usuario en el sistema. */
const handleToggle = async () => {
	if (isSubmitting) return;
	isSubmitting = true;

	try {
		await toggleUserStatus({ id: userId });

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
};
</script>

<button
	type="button"
	onclick={handleToggle}
	role="switch"
	aria-checked={isActive}
	aria-label="Alternar estado del usuario"
	disabled={isSubmitting}
	class={[
		"relative inline-flex h-7.5 w-13.5 shrink-0 cursor-pointer items-center rounded-full border border-zinc-300 p-0.5 transition-colors duration-250 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700",
		isActive
			? "bg-emerald-600 dark:bg-emerald-500"
			: "bg-zinc-200 dark:bg-zinc-800",
	]}
>
	<span
		class={[
			"size-6 rounded-full bg-white shadow-md transition-transform duration-250 ease-in-out dark:bg-zinc-100",
			isActive ? "translate-x-6" : "translate-x-0.5",
		]}
	></span>
	<span class="sr-only">
		Estado del usuario: {isActive ? "Activo" : "Inactivo"}
	</span>
</button>
