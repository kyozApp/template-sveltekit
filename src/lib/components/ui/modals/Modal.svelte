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

const resolvedMaxInlineSize = $derived(
	width === "small"
		? "550px"
		: width === "medium"
			? "650px"
			: width === "large"
				? "1500px"
				: width,
);

// ÚNICA interacción con el DOM: sincronizar el <dialog> al prop isOpen del
// padre.
// No hay setOpen, no hay onClose, no hay reopen, no hay sync al revés.
// El $effect solo LEE isOpen y actualiza el DOM consecuentemente.
// Segun la doc oficial, el cleanup de $effect corre antes de cada re-ejecucion,
// por eso no guardamos flags de destruccion aqui.
// Guards: evita InvalidStateError al llamar showModal/close cuando ya esta en
// ese estado.
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
	oncancel={(e) => {
	// Segun la doc oficial de <dialog>, ESC dispara "cancel" antes del
	// cierre nativo.
	// Interceptamos ese cierre y lo delegamos al mismo flujo controlado
	// del padre.
	e.preventDefault();
	onRequestClose?.();
}}
	aria-modal="true"
	class="modal-dialog"
	style:--modal-max-inline-size={resolvedMaxInlineSize}
>
	{@render children()}
</dialog>

<style>
.modal-dialog {
	inline-size: min(90vi, var(--modal-max-inline-size));
	max-inline-size: 100%;
	max-block-size: 90dvh;
	padding: 0;
	margin: auto;
	overflow: hidden;
	overscroll-behavior: contain;

	background-color: light-dark(oklch(100% 0 0), oklch(25% 0.03 255));
	border: 1px solid light-dark(oklch(90% 0.02 255), oklch(35% 0.03 255));
	border-radius: 12px;
	box-shadow: 0 25px 50px -12px oklch(0% 0 0 / 0.25);

	transition: inline-size 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&::backdrop {
		background-color: light-dark(oklch(0% 0 0 / 0.4), oklch(0% 0 0 / 0.6));
		backdrop-filter: blur(4px);

		transition: backdrop-filter 0.3s ease;
	}

	&[open] {
		display: flex;
		flex-direction: column;
	}
}
</style>
