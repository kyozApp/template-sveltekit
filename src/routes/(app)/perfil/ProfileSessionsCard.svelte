<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { Laptop, LoaderCircle, ShieldAlert, Trash2 } from "@lucide/svelte";

import { revokeProfileSession } from "#lib/remote/profile/profile.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface SessionItem {
	id: string;
	createdAt: string;
	expiresAt: string;
	isCurrent: boolean;
}

interface Props {
	sessions: SessionItem[];
}

let { sessions }: Props = $props();

let revokingId = $state<string | null>(null);

// Cierra y revoca la sesión remota seleccionada
const handleRevoke = async (sessionId: string) => {
	if (revokingId) return;
	revokingId = sessionId;

	try {
		await revokeProfileSession({ sessionId });
		notifications.showToastSuccess("Sesión cerrada con éxito.");
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[PROFILE REVOKE SESSION][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos revocar la sesión en este momento.",
			);
		} else {
			console.error("[PROFILE REVOKE SESSION][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor.",
			);
		}
	} finally {
		revokingId = null;
	}
};
</script>

<div
	class="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-900"
>
	<div class="flex flex-col gap-1">
		<h2 class="text-base font-bold text-zinc-900 dark:text-zinc-50">
			Dispositivos y Sesiones Activas
		</h2>
		<p class="text-xs text-zinc-500 dark:text-zinc-400">
			Supervisa los dispositivos donde mantienes iniciada tu sesión. Puedes
			cerrar el acceso en cualquier sesión remota.
		</p>
	</div>

	<div class="flex flex-col gap-3.5">
		{#if sessions.length === 0}
			<div
				class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-200 py-10 text-center text-zinc-400 dark:border-zinc-800 dark:text-zinc-500"
			>
				<ShieldAlert size={28} />
				<p class="text-sm font-medium">
					No se encontraron registros de sesiones activas.
				</p>
			</div>
		{:else}
			{#each sessions as session (session.id)}
				<div
					class={[
						"flex items-center gap-4 rounded-xl border p-4 transition-colors duration-150",
						session.isCurrent
							? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800/80 dark:bg-emerald-950/20"
							: "border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/60",
					]}
				>
					<div
						class={[
							"flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
							session.isCurrent
								? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
								: "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
						]}
					>
						<Laptop size={18} />
					</div>

					<div class="flex min-w-0 flex-1 flex-col gap-1">
						<div class="flex items-center gap-2.5">
							<span class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
								{session.isCurrent
									? "Dispositivo Actual"
									: "Dispositivo Remoto"}
							</span>
							{#if session.isCurrent}
								<span
									class="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold tracking-wide text-emerald-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-300"
								>
									En línea ahora
								</span>
							{/if}
						</div>
						<div
							class="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
						>
							<span>
								Iniciada el
								{new Date(session.createdAt).toLocaleDateString("es-PE", {
									day: "2-digit",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
							<span class="text-zinc-300 dark:text-zinc-600">•</span>
							<span>
								Expira el
								{new Date(session.expiresAt).toLocaleDateString("es-PE", {
									day: "2-digit",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>

					{#if !session.isCurrent}
						<button
							type="button"
							class="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-transparent bg-transparent text-red-600 transition-all duration-200 hover:not-disabled:border-red-200 hover:not-disabled:bg-red-50 hover:not-disabled:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:not-disabled:border-red-900/60 dark:hover:not-disabled:bg-red-950/40 dark:hover:not-disabled:text-red-300"
							onclick={() => handleRevoke(session.id)}
							disabled={revokingId === session.id}
							aria-label="Cerrar esta sesión remota"
							data-tooltip="Cerrar sesión"
							data-tooltip-position="top-end"
						>
							{#if revokingId === session.id}
								<LoaderCircle size={16} class="animate-spin" />
							{:else}
								<Trash2 size={16} />
							{/if}
						</button>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
