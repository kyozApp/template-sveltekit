<script lang="ts">
import type { Snippet } from "svelte";

import { X } from "@lucide/svelte";

import Modal from "#lib/components/ui/modals/Modal.svelte";

interface Props {
	isOpen: boolean;
	onRequestClose: () => void;
	width: "small" | "medium" | "large" | string;
	header: Snippet;
	children: Snippet;
}

let { isOpen, onRequestClose, width, header, children }: Props = $props();
</script>

<Modal {isOpen} {onRequestClose} {width}>
	<div class="modal-card-container">
		<div class="modal-header">
			<div class="header-left">
				{@render header()}
			</div>
			<button
				type="button"
				class="modal-close-btn"
				onclick={onRequestClose}
				aria-label="Cerrar modal"
			>
				<X size={20} />
			</button>
		</div>

		<div class="modal-body">
			{@render children()}
		</div>
	</div>
</Modal>

<style>
.modal-card-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: light-dark(oklch(98.8% 0.003 248), oklch(17% 0.015 260));
	border-radius: 16px;
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.75rem;
	background-color: light-dark(oklch(98.8% 0.003 248), oklch(17% 0.015 260));
	border-bottom: 1px solid
		light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));

	@media (width < 640px) {
		padding: 1rem 1.25rem;
	}
}

.header-left {
	display: flex;
	flex: 1;
	gap: 0.85rem;
	align-items: center;
}

.modal-close-btn {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 34px;
	height: 34px;
	color: light-dark(oklch(45% 0.01 255), oklch(75% 0.01 255));
	cursor: pointer;
	background-color: light-dark(oklch(96% 0.005 248), oklch(25% 0.02 256.86));
	border: 1px solid light-dark(oklch(88% 0.008 248), oklch(27% 0.015 260));
	border-radius: 10px;
	transition:
		color 0.15s,
		background-color 0.15s;

	&:hover {
		color: light-dark(oklch(20% 0.01 255), oklch(95% 0.01 255));
		background-color: light-dark(oklch(92% 0.01 248), oklch(30% 0.02 256.86));
	}
}

.modal-body {
	display: flex;
	flex-direction: column;
	padding: 1.5rem 1.75rem;

	@media (width < 640px) {
		padding: 1rem 1.25rem;
	}
}
</style>
