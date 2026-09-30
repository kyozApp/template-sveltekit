<script lang="ts">
import type { Component, Snippet } from "svelte";

import { X } from "@lucide/svelte";

import Modal from "#lib/components/ui/modals/Modal.svelte";

interface Props {
	isOpen: boolean;
	onRequestClose: () => void;
	width: "small" | "medium" | "large" | string;
	title: string;
	subtitle: string;
	icon: Component<{ size?: number | string; class?: string }>;
	children: Snippet;
}

let {
	isOpen,
	onRequestClose,
	width,
	title,
	subtitle,
	icon: Icon,
	children,
}: Props = $props();
</script>

<Modal {isOpen} {onRequestClose} {width}>
	<div class="pdf-modal-container">
		<div class="pdf-modal-header">
			<div class="header-left">
				<div class="header-title-row">
					<div class="icon-container">
						<Icon size={22} />
					</div>
					<div>
						<h2 id="modal-title">{title}</h2>
						<p class="subtitle">{subtitle}</p>
					</div>
				</div>
			</div>
			<button
				type="button"
				class="modal-close-btn"
				onclick={onRequestClose}
				aria-label="Cerrar vista previa"
			>
				<X size={20} />
			</button>
		</div>

		<div class="pdf-modal-body">
			{@render children()}
		</div>
	</div>
</Modal>

<style>
.pdf-modal-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
	background-color: light-dark(oklch(98.8% 0.003 248), oklch(17% 0.015 260));
	border-radius: 16px;
}

.pdf-modal-header {
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
	gap: 0.85rem;
	align-items: center;
}

.header-title-row {
	display: flex;
	gap: 0.85rem;
	align-items: center;
}

.icon-container {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	color: light-dark(oklch(40% 0.0096 252.81), oklch(75% 0.02 255));
	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(27.5% 0.032 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.008 248), oklch(27% 0.015 260));
	border-radius: 12px;
}

#modal-title {
	margin: 0;
	font-size: 1.1rem;
	font-weight: 700;
	color: light-dark(oklch(20% 0.015 255), oklch(91% 0.008 260));
}

.subtitle {
	margin: 0;
	font-size: 0.8rem;
	color: light-dark(oklch(48% 0.01 255), oklch(68% 0.012 260));
}

.modal-close-btn {
	display: flex;
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

.pdf-modal-body {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 75vh;
	padding: 0;
	overflow: hidden;
}
</style>
