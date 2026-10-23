<script lang="ts">
import { fly, scale } from "svelte/transition";

import { CircleCheck, CircleX, TriangleAlert, X } from "@lucide/svelte";

import type { ToastPosition } from "#lib/services/notifications.svelte.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

const positions: ToastPosition[] = [
	"top-left",
	"top-right",
	"top-center",
	"bottom-left",
	"bottom-right",
	"bottom-center",
];

// Referencias de elementos DOM para promover los toasts a la Top Layer (Popover API)
let toastPopoverEls = $state<Record<string, HTMLElement>>({});

// Diálogos modales nativos para Alertas y Confirmaciones (Top Layer nativo con apilamiento seguro)
let alertDialogEl = $state<HTMLDialogElement>();
let confirmDialogEl = $state<HTMLDialogElement>();

// Sincroniza los contenedores de toasts con la Popover API de forma reactiva
$effect(() => {
	for (const pos of positions) {
		const el = toastPopoverEls[pos];
		if (el) {
			const hasToasts = notifications.toasts.some((t) => t.position === pos);
			if (hasToasts) {
				try {
					if (el.matches(":popover-open")) {
						el.hidePopover();
					}
					el.showPopover();
				} catch {
					// Ignora excepciones si el navegador ya maneja el estado del popover
				}
			} else {
				try {
					if (el.matches(":popover-open")) {
						el.hidePopover();
					}
				} catch {
					// Ignora excepciones al intentar cerrar el popover
				}
			}
		}
	}
});

// Sincroniza el modal de Alerta como <dialog> nativo con showModal()
$effect(() => {
	if (notifications.alert.show) {
		try {
			if (alertDialogEl && !alertDialogEl.open) {
				alertDialogEl.showModal();
			}
		} catch (e) {
			console.error("[ALERT MODAL ERROR]", e);
		}
	} else {
		try {
			if (alertDialogEl?.open) {
				alertDialogEl.close();
			}
		} catch (e) {
			console.error("[ALERT CLOSE ERROR]", e);
		}
	}
});

// Sincroniza el modal de Confirmación como <dialog> nativo con showModal()
$effect(() => {
	if (notifications.confirmState.show) {
		try {
			if (confirmDialogEl && !confirmDialogEl.open) {
				confirmDialogEl.showModal();
			}
		} catch (e) {
			console.error("[CONFIRM MODAL ERROR]", e);
		}
	} else {
		try {
			if (confirmDialogEl?.open) {
				confirmDialogEl.close();
			}
		} catch (e) {
			console.error("[CONFIRM CLOSE ERROR]", e);
		}
	}
});

// Re-promueve los popovers de toasts al frente cuando se abre cualquier diálogo
const repromoteActivePopovers = () => {
	setTimeout(() => {
		for (const pos of positions) {
			const el = toastPopoverEls[pos];
			if (el) {
				const hasToasts = notifications.toasts.some((t) => t.position === pos);
				if (hasToasts && el.matches(":popover-open")) {
					try {
						el.hidePopover();
						el.showPopover();
					} catch {
						// Ignorar excepciones al re-promover el popover de toasts
					}
				}
			}
		}
	}, 10);
};

// Observador global para reposicionar los toasts al frente cuando se abre o cierra cualquier <dialog>
$effect(() => {
	if (typeof document === "undefined") return;

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.attributeName === "open") {
				const target = mutation.target as HTMLElement;
				if (target.tagName === "DIALOG") {
					repromoteActivePopovers();
				}
			}
		}
	});

	observer.observe(document.body, {
		attributes: true,
		subtree: true,
		attributeFilter: ["open"],
	});

	return () => {
		observer.disconnect();
	};
});
</script>

<!-- Contenedores de Sonner (Toasts agrupados por posición en pantalla) -->
{#each positions as pos (pos)}
	{@const posToasts = notifications.toasts.filter((t) => t.position === pos)}
	<div
		bind:this={toastPopoverEls[pos]}
		popover="manual"
		class={[
			"z-toast pointer-events-none fixed inset-auto m-0 flex w-full max-w-[calc(100%-2rem)] flex-col gap-3 overflow-visible border-0 bg-transparent p-0 sm:max-w-95",
			pos === "top-left" && "top-4 left-4 sm:top-8 sm:left-8",
			pos === "top-right" && "top-4 right-4 sm:top-8 sm:right-8",
			pos === "top-center" &&
				"top-4 left-1/2 -translate-x-1/2 items-center sm:top-8",
			pos === "bottom-left" &&
				"bottom-4 left-4 flex-col-reverse sm:bottom-8 sm:left-8",
			pos === "bottom-right" &&
				"right-4 bottom-4 flex-col-reverse sm:right-8 sm:bottom-8",
			pos === "bottom-center" &&
				"bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center sm:bottom-8",
		]}
	>
		{#each posToasts as toast (toast.id)}
			<div
				class={[
					"pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-2xl border bg-white/95 p-0 text-zinc-900 shadow-lg backdrop-blur-xl transition-all duration-200 dark:bg-zinc-900/95 dark:text-zinc-50",
					toast.type === "success" &&
						"border-emerald-200 shadow-emerald-500/5 dark:border-emerald-900/60",
					toast.type === "warning" &&
						"border-amber-200 shadow-amber-500/5 dark:border-amber-900/60",
					toast.type === "error" &&
						"border-red-200 shadow-red-500/5 dark:border-red-900/60",
				]}
				transition:fly={{ y: pos.startsWith("top") ? -40 : 40, duration: 350 }}
				role="status"
				aria-live="polite"
			>
				<!-- Barra superior de acento con gradiente -->
				<div
					class={[
						"h-1 w-full shrink-0",
						toast.type === "success" && "bg-emerald-500 dark:bg-emerald-400",
						toast.type === "warning" && "bg-amber-500 dark:bg-amber-400",
						toast.type === "error" && "bg-red-500 dark:bg-red-400",
					]}
				></div>

				<div class="flex items-start gap-3.5 p-4">
					<div
						class={[
							"flex size-9 shrink-0 items-center justify-center rounded-xl",
							toast.type === "success" &&
								"bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
							toast.type === "warning" &&
								"bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
							toast.type === "error" &&
								"bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400",
						]}
					>
						{#if toast.type === "success"}
							<CircleCheck size={20} />
						{:else if toast.type === "warning"}
							<TriangleAlert size={20} />
						{:else}
							<CircleX size={20} />
						{/if}
					</div>

					<div class="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
						<p class="text-sm font-bold text-zinc-900 dark:text-zinc-50">
							{#if toast.type === "success"}
								¡Éxito!
							{:else if toast.type === "warning"}
								¡Advertencia!
							{:else}
								¡Error!
							{/if}
						</p>
						<p class="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
							{toast.message}
						</p>
					</div>

					<button
						type="button"
						class="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
						onclick={() => notifications.closeToast(toast.id)}
						aria-label="Cerrar notificación"
					>
						<X size={16} />
					</button>
				</div>
			</div>
		{/each}
	</div>
{/each}

<!-- Diálogo modal de Alerta (Top Layer nativo) -->
<dialog
	bind:this={alertDialogEl}
	class="m-auto border-0 bg-transparent p-0 outline-none backdrop:bg-zinc-950/60 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
	oncancel={(e) => {
		e.preventDefault();
		notifications.closeAlert();
	}}
>
	{#if notifications.alert.show}
		<div
			class={[
				"relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl border bg-white p-8 text-center shadow-2xl backdrop-blur-2xl dark:bg-zinc-900",
				notifications.alert.type === "success" &&
					"border-emerald-200 dark:border-emerald-900/60",
				notifications.alert.type === "warning" &&
					"border-amber-200 dark:border-amber-900/60",
				notifications.alert.type === "error" &&
					"border-red-200 dark:border-red-900/60",
			]}
			transition:scale={{ start: 0.9, duration: 250 }}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="alert-title"
			aria-describedby="alert-desc"
		>
			<div
				class={[
					"absolute inset-x-0 top-0 h-1.5",
					notifications.alert.type === "success" &&
						"bg-emerald-500 dark:bg-emerald-400",
					notifications.alert.type === "warning" &&
						"bg-amber-500 dark:bg-amber-400",
					notifications.alert.type === "error" && "bg-red-500 dark:bg-red-400",
				]}
			></div>

			<div class="flex w-full flex-col items-center gap-3">
				<div
					class={[
						"flex size-16 items-center justify-center rounded-2xl",
						notifications.alert.type === "success" &&
							"bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
						notifications.alert.type === "warning" &&
							"bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
						notifications.alert.type === "error" &&
							"bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400",
					]}
				>
					{#if notifications.alert.type === "success"}
						<CircleCheck size={36} />
					{:else if notifications.alert.type === "warning"}
						<TriangleAlert size={36} />
					{:else}
						<CircleX size={36} />
					{/if}
				</div>
				<h2
					id="alert-title"
					class="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
				>
					{notifications.alert.title}
				</h2>
			</div>

			<div class="mt-3 w-full">
				<p
					id="alert-desc"
					class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"
				>
					{notifications.alert.message}
				</p>
			</div>

			<div class="mt-7 flex w-full justify-center">
				<button
					type="button"
					class={[
						"inline-flex w-full cursor-pointer items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200",
						notifications.alert.type === "success" &&
							"border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500",
						notifications.alert.type === "warning" &&
							"border border-amber-600 bg-amber-600 hover:bg-amber-700 dark:border-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500",
						notifications.alert.type === "error" &&
							"border border-red-600 bg-red-600 hover:bg-red-700 dark:border-red-500 dark:bg-red-600 dark:hover:bg-red-500",
					]}
					onclick={() => notifications.closeAlert()}
				>
					Entendido
				</button>
			</div>
		</div>
	{/if}
</dialog>

<!-- Diálogo modal de Confirmación (Top Layer nativo con Cancelar/Aceptar) -->
<dialog
	bind:this={confirmDialogEl}
	class="m-auto border-0 bg-transparent p-0 outline-none backdrop:bg-zinc-950/60 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
	oncancel={(e) => {
		e.preventDefault();
		notifications.resolveConfirm(false);
	}}
>
	{#if notifications.confirmState.show}
		<div
			class="relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-2xl backdrop-blur-2xl dark:border-amber-900/60 dark:bg-zinc-900"
			transition:scale={{ start: 0.9, duration: 250 }}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
			aria-describedby="confirm-desc"
		>
			<div
				class="absolute inset-x-0 top-0 h-1.5 bg-amber-500 dark:bg-amber-400"
			></div>

			<div class="flex w-full flex-col items-center gap-3">
				<div
					class="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
				>
					<TriangleAlert size={36} />
				</div>
				<h2
					id="confirm-title"
					class="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
				>
					{notifications.confirmState.title}
				</h2>
			</div>

			<div class="mt-3 w-full">
				<p
					id="confirm-desc"
					class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"
				>
					{notifications.confirmState.message}
				</p>
			</div>

			<div class="mt-7 flex w-full gap-3">
				<button
					type="button"
					class="inline-flex w-1/2 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
					onclick={() => notifications.resolveConfirm(false)}
				>
					Cancelar
				</button>
				<button
					type="button"
					class="inline-flex w-1/2 cursor-pointer items-center justify-center rounded-xl border border-amber-600 bg-amber-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-amber-700 hover:bg-amber-700 dark:border-amber-500 dark:bg-amber-600 dark:hover:border-amber-600 dark:hover:bg-amber-500"
					onclick={() => notifications.resolveConfirm(true)}
				>
					Aceptar
				</button>
			</div>
		</div>
	{/if}
</dialog>
