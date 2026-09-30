<script lang="ts">
import { fade, fly, scale } from "svelte/transition";

import { CircleCheck, CircleX, TriangleAlert, X } from "@lucide/svelte";

import type { ToastPosition } from "#lib/services/notifications.svelte";
import { notifications } from "#lib/services/notifications.svelte";

const positions: ToastPosition[] = [
	"top-left",
	"top-right",
	"top-center",
	"bottom-left",
	"bottom-right",
	"bottom-center",
];

// Referencias de elementos DOM para promoverlos a la Top Layer (Popover API)
let toastPopoverEls = $state<Record<string, HTMLElement>>({});
let alertPopoverEl = $state<HTMLElement>();
let confirmPopoverEl = $state<HTMLElement>();

// Sincroniza los contenedores de toasts con la Popover API de forma reactiva
$effect(() => {
	for (const pos of positions) {
		const el = toastPopoverEls[pos];
		if (el) {
			const hasToasts = notifications.toasts.some((t) => t.position === pos);
			if (hasToasts) {
				try {
					// Si ya está abierto, hide y show lo fuerza a reposicionarse al
					// frente de la Top Layer
					if (el.matches(":popover-open")) {
						el.hidePopover();
					}
					el.showPopover();
				} catch {
					// Ignora excepciones si el navegador ya maneja el estado del
					// popover o si se está desmontando
				}
			} else {
				try {
					if (el.matches(":popover-open")) {
						el.hidePopover();
					}
				} catch {
					// Ignora excepciones al intentar cerrar el popover si el
					// navegador ya lo hizo automáticamente
				}
			}
		}
	}
});

// Sincroniza el modal de Alerta con la Popover API de forma reactiva
$effect(() => {
	if (notifications.alert.show) {
		try {
			if (alertPopoverEl?.matches(":popover-open")) {
				alertPopoverEl.hidePopover();
			}
			alertPopoverEl?.showPopover();
		} catch {
			try {
				alertPopoverEl?.showPopover();
			} catch {
				// Ignora excepciones de estado del popover de alerta al forzar
				// su apertura
			}
		}
	} else {
		try {
			if (alertPopoverEl?.matches(":popover-open")) {
				alertPopoverEl.hidePopover();
			}
		} catch {
			// Ignora excepciones del navegador al cerrar la alerta
		}
	}
});

// Sincroniza el modal de Confirmación con la Popover API de forma reactiva
$effect(() => {
	if (notifications.confirmState.show) {
		try {
			if (confirmPopoverEl?.matches(":popover-open")) {
				confirmPopoverEl.hidePopover();
			}
			confirmPopoverEl?.showPopover();
		} catch {
			try {
				confirmPopoverEl?.showPopover();
			} catch {
				// Ignora excepciones de estado del popover de confirmación al
				// forzar su apertura
			}
		}
	} else {
		try {
			if (confirmPopoverEl?.matches(":popover-open")) {
				confirmPopoverEl.hidePopover();
			}
		} catch {
			// Ignora excepciones del navegador al cerrar la confirmación
		}
	}
});

// Re-promueve todas las notificaciones activas al frente de la Top Layer
const repromoteActivePopovers = () => {
	// Pequeño retardo de 10ms para permitir que el diálogo modal termine de
	// registrarse en la Top Layer
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

		// También re-promover el modal de alerta si está activo
		if (notifications.alert.show && alertPopoverEl?.matches(":popover-open")) {
			try {
				alertPopoverEl.hidePopover();
				alertPopoverEl.showPopover();
			} catch {
				// Ignorar excepciones al re-promover el popover de alerta
			}
		}

		// También re-promover el modal de confirmación si está activo
		if (
			notifications.confirmState.show &&
			confirmPopoverEl?.matches(":popover-open")
		) {
			try {
				confirmPopoverEl.hidePopover();
				confirmPopoverEl.showPopover();
			} catch {
				// Ignorar excepciones al re-promover el popover de confirmación
			}
		}
	}, 10);
};

// Observador global para reposicionar las notificaciones al frente cuando
// se abre o cierra cualquier <dialog> (modal)
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
		class="sonner-container pos-{pos}"
	>
		{#each posToasts as toast (toast.id)}
			<div
				class="sonner-toast sonner-{toast.type}"
				transition:fly={{ y: pos.startsWith("top") ? -50 : 50, duration: 350 }}
				role="status"
				aria-live="polite"
			>
				<div class="sonner-glow"></div>
				<div class="sonner-content">
					<div class="icon-wrapper">
						{#if toast.type === "success"}
							<CircleCheck size="20" />
						{:else if toast.type === "warning"}
							<TriangleAlert size="20" />
						{:else}
							<CircleX size="20" />
						{/if}
					</div>
					<div class="sonner-body">
						<p class="sonner-title">
							{#if toast.type === "success"}
								¡Éxito!
							{:else if toast.type === "warning"}
								¡Advertencia!
							{:else}
								¡Error!
							{/if}
						</p>
						<p class="sonner-message">{toast.message}</p>
					</div>
					<button
						type="button"
						class="sonner-close-btn"
						onclick={() => notifications.closeToast(toast.id)}
						aria-label="Cerrar notificación"
					>
						<X size="16" />
					</button>
				</div>
				<div
					class="sonner-progress"
					style="animation-duration: {toast.duration}ms;"
				></div>
			</div>
		{/each}
	</div>
{/each}

<!-- Contenedor del Alert (Modal central, no se oculta hasta dar clic) -->
<div bind:this={alertPopoverEl} popover="manual" class="alert-popover">
	{#if notifications.alert.show}
		<div
			class="alert-backdrop"
			transition:fade={{ duration: 250 }}
			role="presentation"
		>
			<div
				class="alert-modal alert-{notifications.alert.type}"
				transition:scale={{ start: 0.9, duration: 250 }}
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="alert-title"
				aria-describedby="alert-desc"
			>
				<div class="alert-glow"></div>

				<div class="alert-header">
					<div class="icon-wrapper">
						{#if notifications.alert.type === "success"}
							<CircleCheck size="36" />
						{:else if notifications.alert.type === "warning"}
							<TriangleAlert size="36" />
						{:else}
							<CircleX size="36" />
						{/if}
					</div>
					<h2 id="alert-title" class="alert-title">
						{notifications.alert.title}
					</h2>
				</div>

				<div class="alert-body">
					<p id="alert-desc" class="alert-message">
						{notifications.alert.message}
					</p>
				</div>

				<div class="alert-actions">
					<button
						type="button"
						class="btn-alert-confirm"
						onclick={() => notifications.closeAlert()}
					>
						Entendido
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Contenedor del Confirm Alert
     (Modal de confirmación asíncrono con Cancelar/Aceptar) -->
<div bind:this={confirmPopoverEl} popover="manual" class="alert-popover">
	{#if notifications.confirmState.show}
		<div
			class="alert-backdrop"
			transition:fade={{ duration: 250 }}
			role="presentation"
		>
			<div
				class="alert-modal alert-warning"
				transition:scale={{ start: 0.9, duration: 250 }}
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="confirm-title"
				aria-describedby="confirm-desc"
			>
				<div class="alert-glow"></div>

				<div class="alert-header">
					<div class="icon-wrapper">
						<TriangleAlert size="36" />
					</div>
					<h2 id="confirm-title" class="alert-title">
						{notifications.confirmState.title}
					</h2>
				</div>

				<div class="alert-body">
					<p id="confirm-desc" class="alert-message">
						{notifications.confirmState.message}
					</p>
				</div>

				<div class="alert-actions confirm-buttons-layout">
					<button
						type="button"
						class="btn-confirm-cancel"
						onclick={() => notifications.resolveConfirm(false)}
					>
						Cancelar
					</button>
					<button
						type="button"
						class="btn-confirm-accept"
						onclick={() => notifications.resolveConfirm(true)}
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
.alert-popover {
	&[popover] {
		inset: 0;

		width: 100dvw;
		height: 100dvh;
		padding: 0;
		margin: 0;

		overflow: hidden;

		background: transparent;
		border: none;
	}

	&:popover-open {
		display: block;
	}
}

.sonner-container {
	position: fixed;
	z-index: var(--z-toast);

	display: flex;
	flex-direction: column;
	gap: 0.75rem;

	width: 100%;
	max-width: 380px;
	pointer-events: none;

	transition: all 0.3s ease;

	&[popover] {
		inset: auto;

		width: 100%;
		height: auto;
		padding: 0;
		margin: 0;

		overflow: visible;

		background: transparent;
		border: none;
	}

	&:popover-open {
		display: flex;
	}

	&.pos-top-left {
		top: 2rem;
		left: 2rem;
	}

	&.pos-top-right {
		top: 2rem;
		right: 2rem;
	}

	&.pos-top-center {
		top: 2rem;
		left: 50%;

		align-items: center;
		transform: translateX(-50%);
	}

	&.pos-bottom-left {
		bottom: 2rem;
		left: 2rem;

		flex-direction: column-reverse;
	}

	&.pos-bottom-right {
		right: 2rem;
		bottom: 2rem;

		flex-direction: column-reverse;
	}

	&.pos-bottom-center {
		bottom: 2rem;
		left: 50%;

		flex-direction: column-reverse;
		align-items: center;
		transform: translateX(-50%);
	}

	@media (width <= 640px) {
		right: 1rem;
		left: 1rem;

		max-width: calc(100% - 2rem);
		transform: none;

		&.pos-top-left,
		&.pos-top-right,
		&.pos-top-center {
			top: 1rem;
			bottom: auto;
		}

		&.pos-bottom-left,
		&.pos-bottom-right,
		&.pos-bottom-center {
			top: auto;
			bottom: 1rem;
		}
	}
}

.sonner-toast {
	display: flex;
	flex-direction: column;

	width: 100%;

	overflow: hidden;

	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	pointer-events: auto;

	background: light-dark(oklch(100% 0 0 / 0.85), oklch(25% 0.03 255 / 0.85));
	border-radius: 14px;
	backdrop-filter: blur(16px);

	transition:
		border-color 0.25s ease,
		box-shadow 0.25s ease;

	&.sonner-success {
		border: 1px solid
			light-dark(oklch(72% 0.2 142 / 0.3), oklch(72% 0.2 142 / 0.2));
		box-shadow:
			0 10px 25px -5px oklch(0% 0 0 / 0.1),
			0 8px 10px -6px oklch(0% 0 0 / 0.1),
			0 0 20px light-dark(oklch(72% 0.2 142 / 0.05), oklch(72% 0.2 142 / 0.1));
	}

	&.sonner-warning {
		border: 1px solid
			light-dark(oklch(76% 0.18 78 / 0.3), oklch(76% 0.18 78 / 0.2));
		box-shadow:
			0 10px 25px -5px oklch(0% 0 0 / 0.1),
			0 8px 10px -6px oklch(0% 0 0 / 0.1),
			0 0 20px light-dark(oklch(76% 0.18 78 / 0.05), oklch(76% 0.18 78 / 0.1));
	}

	&.sonner-error {
		border: 1px solid
			light-dark(oklch(62% 0.25 35 / 0.3), oklch(62% 0.25 35 / 0.2));
		box-shadow:
			0 10px 25px -5px oklch(0% 0 0 / 0.1),
			0 8px 10px -6px oklch(0% 0 0 / 0.1),
			0 0 20px light-dark(oklch(62% 0.25 35 / 0.05), oklch(62% 0.25 35 / 0.1));
	}
}

.sonner-glow {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;

	height: 3px;
}

.sonner-success .sonner-glow {
	background: linear-gradient(
		90deg,
		oklch(72% 0.2 142),
		oklch(83% 0.18 140),
		oklch(72% 0.2 142)
	);
	background-size: 200% 100%;

	animation: gradient-shift-3s-sonner-success-glow 3s linear infinite;
}

@keyframes gradient-shift-3s-sonner-success-glow {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.sonner-warning .sonner-glow {
	background: linear-gradient(
		90deg,
		oklch(76% 0.18 78),
		oklch(84% 0.18 78),
		oklch(76% 0.18 78)
	);
	background-size: 200% 100%;

	animation: gradient-shift-3s-sonner-warning-glow 3s linear infinite;
}

@keyframes gradient-shift-3s-sonner-warning-glow {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.sonner-error .sonner-glow {
	background: linear-gradient(
		90deg,
		oklch(62% 0.25 35),
		oklch(70% 0.22 35),
		oklch(62% 0.25 35)
	);
	background-size: 200% 100%;

	animation: gradient-shift-3s-sonner-error-glow 3s linear infinite;
}

@keyframes gradient-shift-3s-sonner-error-glow {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.sonner-content {
	position: relative;

	display: flex;
	gap: 0.875rem;
	align-items: flex-start;

	padding: 1.25rem;
}

.sonner-toast .icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;

	padding: 0.45rem;
	border-radius: 10px;

	box-shadow: 0 0 10px oklch(0% 0 0 / 0.05);
}

.sonner-success .icon-wrapper {
	color: oklch(72% 0.2 142);

	background-color: light-dark(
		oklch(72% 0.2 142 / 0.1),
		oklch(72% 0.2 142 / 0.15)
	);
	border: 1px solid
		light-dark(oklch(72% 0.2 142 / 0.2), oklch(72% 0.2 142 / 0.3));
}

.sonner-warning .icon-wrapper {
	color: oklch(76% 0.18 78);

	background-color: light-dark(
		oklch(76% 0.18 78 / 0.1),
		oklch(76% 0.18 78 / 0.15)
	);
	border: 1px solid
		light-dark(oklch(76% 0.18 78 / 0.2), oklch(76% 0.18 78 / 0.3));
}

.sonner-error .icon-wrapper {
	color: oklch(62% 0.25 35);

	background-color: light-dark(
		oklch(62% 0.25 35 / 0.1),
		oklch(62% 0.25 35 / 0.15)
	);
	border: 1px solid
		light-dark(oklch(62% 0.25 35 / 0.2), oklch(62% 0.25 35 / 0.3));
}

.sonner-body {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.2rem;

	padding-top: 0.15rem;
}

.sonner-title {
	margin: 0;

	font-size: 0.95rem;
	font-weight: 700;
}

.sonner-success .sonner-title {
	color: light-dark(oklch(40% 0.15 140), oklch(83% 0.18 140));
}

.sonner-warning .sonner-title {
	color: light-dark(oklch(45% 0.12 78), oklch(84% 0.18 78));
}

.sonner-error .sonner-title {
	color: light-dark(oklch(35% 0.15 28), oklch(70% 0.22 35));
}

.sonner-message {
	margin: 0;

	font-size: 0.875rem;
	line-height: 1.4;
	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
}

.sonner-close-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.25rem;

	margin-top: 0.15rem;

	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
	cursor: pointer;

	background: none;
	border: none;
	border-radius: 6px;

	transition: all 0.2s ease;

	&:hover {
		color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
		background-color: light-dark(oklch(0% 0 0 / 0.05), oklch(100% 0 0 / 0.05));
	}
}

.sonner-progress {
	position: absolute;
	bottom: 0;
	left: 0;

	width: 100%;
	height: 3px;

	animation: width-out-3p5s-sonner-progress 3.5s linear forwards;
}

@keyframes width-out-3p5s-sonner-progress {
	0% {
		width: 100%;
	}

	100% {
		width: 0%;
	}
}

.sonner-success .sonner-progress {
	background-color: oklch(72% 0.2 142);
}

.sonner-warning .sonner-progress {
	background-color: oklch(76% 0.18 78);
}

.sonner-error .sonner-progress {
	background-color: oklch(62% 0.25 35);
}

.alert-backdrop {
	position: fixed;
	inset: 0;
	z-index: var(--z-progress-bar);

	display: flex;
	align-items: center;
	justify-content: center;

	padding: 1.5rem;

	background-color: oklch(18% 0.03 260 / 0.6);
	backdrop-filter: blur(12px);
}

.alert-modal {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;
	max-width: 480px;
	padding: 2.25rem 2rem 2rem;

	overflow: hidden;

	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	text-align: center;

	background: light-dark(oklch(100% 0 0), oklch(25% 0.03 255));
	border-radius: 20px;

	transition:
		border-color 0.25s ease,
		box-shadow 0.25s ease;

	&.alert-success {
		border: 1px solid
			light-dark(oklch(72% 0.2 142 / 0.4), oklch(72% 0.2 142 / 0.3));
		box-shadow:
			0 25px 50px -12px oklch(0% 0 0 / 0.25),
			0 0 35px light-dark(oklch(72% 0.2 142 / 0.08), oklch(72% 0.2 142 / 0.15));
	}

	&.alert-warning {
		border: 1px solid
			light-dark(oklch(76% 0.18 78 / 0.4), oklch(76% 0.18 78 / 0.3));
		box-shadow:
			0 25px 50px -12px oklch(0% 0 0 / 0.25),
			0 0 35px light-dark(oklch(76% 0.18 78 / 0.08), oklch(76% 0.18 78 / 0.15));
	}

	&.alert-error {
		border: 1px solid
			light-dark(oklch(62% 0.25 35 / 0.4), oklch(62% 0.25 35 / 0.3));
		box-shadow:
			0 25px 50px -12px oklch(0% 0 0 / 0.25),
			0 0 35px light-dark(oklch(62% 0.25 35 / 0.08), oklch(62% 0.25 35 / 0.15));
	}
}

.alert-glow {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;

	height: 4px;
}

.alert-success .alert-glow {
	background: linear-gradient(
		90deg,
		oklch(72% 0.2 142),
		oklch(83% 0.18 140),
		oklch(72% 0.2 142)
	);
	background-size: 200% 100%;

	animation: gradient-shift-3s-alert-success-glow 3s linear infinite;
}

@keyframes gradient-shift-3s-alert-success-glow {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.alert-warning .alert-glow {
	background: linear-gradient(
		90deg,
		oklch(76% 0.18 78),
		oklch(84% 0.18 78),
		oklch(76% 0.18 78)
	);
	background-size: 200% 100%;

	animation: gradient-shift-3s-alert-warning-glow 3s linear infinite;
}

@keyframes gradient-shift-3s-alert-warning-glow {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.alert-error .alert-glow {
	background: linear-gradient(
		90deg,
		oklch(62% 0.25 35),
		oklch(70% 0.22 35),
		oklch(62% 0.25 35)
	);
	background-size: 200% 100%;

	animation: gradient-shift-3s-alert-error-glow 3s linear infinite;
}

@keyframes gradient-shift-3s-alert-error-glow {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.alert-modal .icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;

	margin-bottom: 1.25rem;
	border-radius: 50%;

	animation: pulse-2p5s-alert-modal-icon-wrapper 2.5s
		cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-2p5s-alert-modal-icon-wrapper {
	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}

	50% {
		transform: scale(1.03);
		opacity: 0.85;
	}
}

.alert-success .icon-wrapper {
	color: light-dark(oklch(40% 0.15 140), oklch(83% 0.18 140));

	background-color: light-dark(
		oklch(72% 0.2 142 / 0.08),
		oklch(72% 0.2 142 / 0.12)
	);
	border: 1px solid
		light-dark(oklch(72% 0.2 142 / 0.2), oklch(72% 0.2 142 / 0.25));
	box-shadow:
		0 0 20px oklch(72% 0.2 142 / 0.1),
		inset 0 0 10px oklch(72% 0.2 142 / 0.05);
}

.alert-warning .icon-wrapper {
	color: light-dark(oklch(45% 0.12 78), oklch(84% 0.18 78));

	background-color: light-dark(
		oklch(76% 0.18 78 / 0.08),
		oklch(76% 0.18 78 / 0.12)
	);
	border: 1px solid
		light-dark(oklch(76% 0.18 78 / 0.2), oklch(76% 0.18 78 / 0.25));
	box-shadow:
		0 0 20px oklch(76% 0.18 78 / 0.1),
		inset 0 0 10px oklch(76% 0.18 78 / 0.05);
}

.alert-error .icon-wrapper {
	color: light-dark(oklch(35% 0.15 28), oklch(70% 0.22 35));

	background-color: light-dark(
		oklch(62% 0.25 35 / 0.08),
		oklch(62% 0.25 35 / 0.12)
	);
	border: 1px solid
		light-dark(oklch(62% 0.25 35 / 0.2), oklch(62% 0.25 35 / 0.25));
	box-shadow:
		0 0 20px oklch(62% 0.25 35 / 0.1),
		inset 0 0 10px oklch(62% 0.25 35 / 0.05);
}

.alert-header {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: center;

	width: 100%;
}

.alert-title {
	margin: 0;

	font-size: 1.4rem;
	font-weight: 800;
	letter-spacing: -0.025em;
}

.alert-success .alert-title {
	color: light-dark(oklch(40% 0.15 140), oklch(83% 0.18 140));
}

.alert-warning .alert-title {
	color: light-dark(oklch(45% 0.12 78), oklch(84% 0.18 78));
}

.alert-error .alert-title {
	color: light-dark(oklch(35% 0.15 28), oklch(70% 0.22 35));
}

.alert-body {
	width: 100%;
	margin-top: 1rem;
}

.alert-message {
	margin: 0;

	font-size: 0.95rem;
	font-weight: 500;
	line-height: 1.55;
	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
}

.alert-actions {
	display: flex;
	justify-content: center;

	width: 100%;
	margin-top: 2rem;

	&.confirm-buttons-layout {
		gap: 1rem;
	}
}

.btn-alert-confirm {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	padding: 0.875rem 2rem;

	font-size: 0.95rem;
	font-weight: 700;
	color: oklch(100% 0 0);
	cursor: pointer;
	border: none;
	border-radius: 12px;

	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-success .btn-alert-confirm {
	background-color: oklch(72% 0.2 142);
	box-shadow: 0 4px 12px oklch(72% 0.2 142 / 0.2);

	&:hover {
		background-color: oklch(40% 0.15 140);
		box-shadow: 0 6px 16px oklch(72% 0.2 142 / 0.3);
		transform: translateY(-1.5px);
	}

	&:active {
		transform: translateY(0);
	}
}

.alert-warning .btn-alert-confirm {
	background-color: oklch(76% 0.18 78);
	box-shadow: 0 4px 12px oklch(76% 0.18 78 / 0.2);

	&:hover {
		background-color: oklch(45% 0.12 78);
		box-shadow: 0 6px 16px oklch(76% 0.18 78 / 0.3);
		transform: translateY(-1.5px);
	}

	&:active {
		transform: translateY(0);
	}
}

.alert-error .btn-alert-confirm {
	background-color: oklch(62% 0.25 35);
	box-shadow: 0 4px 12px oklch(62% 0.25 35);

	&:hover {
		background-color: oklch(55% 0.24 28);
		box-shadow: 0 6px 16px oklch(62% 0.25 35 / 0.3);
		transform: translateY(-1.5px);
	}

	&:active {
		transform: translateY(0);
	}
}

.btn-confirm-cancel {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: 50%;
	padding: 0.875rem 2rem;

	font-size: 0.95rem;
	font-weight: 700;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	cursor: pointer;

	background-color: light-dark(oklch(100% 0 0), oklch(25% 0.03 255));
	border: 1px solid light-dark(oklch(90% 0.02 255), oklch(35% 0.03 255));
	border-radius: 12px;

	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		background-color: light-dark(oklch(95% 0.01 250), oklch(35% 0.02 255));
	}
}

.btn-confirm-accept {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: 50%;
	padding: 0.875rem 2rem;

	font-size: 0.95rem;
	font-weight: 700;
	color: oklch(100% 0 0);
	cursor: pointer;

	background-color: oklch(76% 0.18 78);
	border: none;
	border-radius: 12px;
	box-shadow: 0 4px 12px oklch(76% 0.18 78 / 0.2);

	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		background-color: oklch(45% 0.12 78);
		box-shadow: 0 6px 16px oklch(76% 0.18 78 / 0.3);
		transform: translateY(-1.5px);
	}

	&:active {
		transform: translateY(0);
	}
}
</style>
