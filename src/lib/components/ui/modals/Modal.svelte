<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	isOpen: boolean;
	onRequestClose?: () => void;
	width?: "small" | "medium" | "large" | string;
	children: Snippet;
}

// Solo props declarativas. Nada de estado interno ni $bindable.
// El control de apertura/cierre es 100% responsabilidad del padre via isOpen.
// El estado del modal siempre es binario: true = abierto, false = cerrado.
// isOpen: REQUIRED (sin default, sin fallback). El padre siempre lo pasa.
// onRequestClose: opcional. Permite que ESC delegue el cierre al flujo del
// padre.
// width: opcional con default interno 'medium' solo para comodidad de uso.
// children: REQUIRED (snippet del contenido a renderizar dentro del modal).
let { isOpen, onRequestClose, width = "medium", children }: Props = $props();

// Cada instancia tiene su propia referencia al <dialog> nativo.
// Al anidar modales N niveles, cada instancia opera sobre su propio dialogEl,
// y showModal() los apila correctamente en el top layer del navegador.
let dialogEl = $state<HTMLDialogElement | null>(null);

const widthClass = $derived(
	width === "small"
		? "max-w-xl"
		: width === "medium"
			? "max-w-2xl"
			: width === "large"
				? "max-w-7xl"
				: width,
);

// Intercepta el evento de cancelación nativo (ESC) y delega el cierre al controlador del padre
const handleCancel = (e: Event) => {
	e.preventDefault();
	onRequestClose?.();
};

// ÚNICA interacción con el DOM: sincronizar el <dialog> al prop isOpen del padre.
// No hay setOpen, no hay onClose, no hay reopen, no hay sync al revés.
// El $effect solo LEE isOpen y actualiza el DOM consecuentemente.
// Según la doc oficial, el cleanup de $effect corre antes de cada re-ejecución,
// por eso no guardamos flags de destrucción aquí.
// Guards: evita InvalidStateError al llamar showModal/close cuando ya está en ese estado.
$effect(() => {
	if (!dialogEl) return;

	if (isOpen && !dialogEl.open) {
		dialogEl.showModal();
	} else if (!isOpen && dialogEl.open) {
		dialogEl.close();
	}
});
</script>

<dialog
	bind:this={dialogEl}
	oncancel={handleCancel}
	aria-modal="true"
	class={[
		"m-auto max-h-[90dvh] w-11/12 overflow-hidden overscroll-contain rounded-2xl border border-zinc-200 bg-white p-0 shadow-2xl transition-all duration-300 outline-none backdrop:bg-zinc-950/60 backdrop:backdrop-blur-xs open:flex open:flex-col dark:border-zinc-800 dark:bg-zinc-900",
		widthClass,
	]}
>
	{@render children()}
</dialog>
