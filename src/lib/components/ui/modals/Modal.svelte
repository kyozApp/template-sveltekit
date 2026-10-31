<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	isOpen: boolean;
	onRequestClose?: () => void;
	width?: "small" | "medium" | "large" | string;
	children: Snippet;
}

/**
 * Props declarativas del primitivo, sin estado interno ni `$bindable`: `isOpen`
 * es obligatorio (binario, sin default); `onRequestClose` es opcional y permite
 * delegar el cierre por ESC al padre; `width` tiene default `"medium"`;
 * `children` es obligatorio.
 */
let { isOpen, onRequestClose, width = "medium", children }: Props = $props();

/**
 * Referencia al `<dialog>` nativo propia de cada instancia: al anidar modales,
 * cada uno opera sobre su propio `dialogEl` y `showModal()` los apila en el top
 * layer del navegador.
 */
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

// Intercepta el evento de cancelación nativo del dialog y delega el cierre al controlador del padre
const handleCancel = (e: Event) => {
	if (e.target !== dialogEl) {
		return;
	}

	e.preventDefault();
	onRequestClose?.();
};

/**
 * Única interacción con el DOM: sincroniza el `<dialog>` con el prop `isOpen`.
 * Solo lee `isOpen`; los guards con `dialogEl.open` evitan `InvalidStateError`.
 */
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
