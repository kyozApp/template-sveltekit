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
	<div class="form-modal-container">
		<div class="create-modal-header">
			<div class="header-surface">
				<div class="header-content">
					<div class="header-left">
						<span class="header-icon">
							<Icon size={22} />
						</span>
						<div class="header-text">
							<h2 id="modal-title" class="modal-title">{title}</h2>
							<p class="modal-subtitle">{subtitle}</p>
						</div>
					</div>
					<button
						type="button"
						class="modal-close-btn"
						onclick={onRequestClose}
						aria-label="Cerrar modal"
					>
						<span class="modal-close-icon"><X size={18} /></span>
					</button>
				</div>
			</div>
		</div>

		<div class="form-divider"></div>

		{@render children()}
	</div>
</Modal>

<style>
.form-modal-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
	background-color: light-dark(oklch(98.8% 0.003 248), oklch(17% 0.015 260));
	border-radius: 16px;
}

.create-modal-header {
	position: relative;
	flex-shrink: 0;
}

.header-surface {
	position: relative;
	background-color: light-dark(oklch(98.8% 0.003 248), oklch(17% 0.015 260));
}

.header-content {
	position: relative;
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: space-between;
	padding-block: 1.2rem;
	padding-inline: 2rem;

	@media (width < 640px) {
		padding-block: 1rem;
		padding-inline: 1.25rem;
	}
}

.header-left {
	display: flex;
	flex: 1;
	gap: 0.85rem;
	align-items: center;

	@media (width < 640px) {
		gap: 0.75rem;
	}
}

.header-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	inline-size: 44px;
	block-size: 44px;
	color: light-dark(oklch(40% 0.0096 252.81), oklch(75% 0.02 255));
	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(27.5% 0.032 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.008 248), oklch(27% 0.015 260));
	border-radius: 14px;

	@media (width < 640px) {
		inline-size: 40px;
		block-size: 40px;
		border-radius: 12px;
	}
}

.header-text {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	justify-content: center;
}

.modal-title {
	margin: 0;
	font-size: 1.15rem;
	font-weight: 700;
	line-height: 1.15;
	color: light-dark(oklch(23% 0.012 255), oklch(95% 0.004 255));
	letter-spacing: -0.02em;

	@media (width < 640px) {
		font-size: 1.05rem;
	}
}

.modal-subtitle {
	margin: 0;
	font-size: 0.82rem;
	font-weight: 500;
	color: light-dark(oklch(49% 0.008 255), oklch(71% 0.008 255));
}

.modal-close-btn {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	inline-size: 38px;
	block-size: 38px;
	padding: 0;
	color: light-dark(oklch(37% 0.02 245), oklch(75% 0.02 255));
	cursor: pointer;
	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(27.5% 0.032 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 12px;
	transition:
		color 0.18s ease,
		border-color 0.18s ease,
		background-color 0.18s ease;

	&:hover {
		color: light-dark(oklch(29% 0.03 245), oklch(82% 0.024 255));
		background-color: light-dark(
			oklch(98.2% 0.004 248),
			oklch(30% 0.038 256.86)
		);
		border-color: light-dark(oklch(82% 0.01 248), oklch(38% 0.026 256.86));
	}
}

.modal-close-icon {
	pointer-events: none;
}

.form-divider {
	block-size: 1px;
	background-color: light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
}
</style>
