<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { resolve } from "$app/paths";

import { LoaderCircle, LogOut, Settings, User } from "@lucide/svelte";

import { ROLE_LABELS } from "#lib/constants.ts";
import { logoutUser } from "#lib/remote/auth/auth.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface Props {
	user: App.AuthenticatedLocals["user"];
}

let { user }: Props = $props();

let isOpen = $state(false);
let isSubmitting = $state(false);
let menuContainer = $state<HTMLDivElement | null>(null);

const isAdmin = $derived(user.role === "ADMIN");

const initials = $derived.by(() => {
	const name = user.name;
	if (!name) return "U";
	return name
		.split(" ")
		.map((part: string) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
});

// Cierre automático al hacer clic afuera o presionar tecla Escape
$effect(() => {
	if (!isOpen) return;

	const handleClickOutside = (e: MouseEvent) => {
		if (menuContainer && !menuContainer.contains(e.target as Node)) {
			isOpen = false;
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			isOpen = false;
		}
	};

	document.addEventListener("click", handleClickOutside);
	document.addEventListener("keydown", handleKeyDown);

	return () => {
		document.removeEventListener("click", handleClickOutside);
		document.removeEventListener("keydown", handleKeyDown);
	};
});

const handleLogout = async () => {
	if (isSubmitting) return;
	isSubmitting = true;

	try {
		await logoutUser();
		window.location.href = "/iniciar-sesion";
	} catch (e) {
		if (isHttpError(e)) {
			notifications.showToastError(
				"No pudimos cerrar la sesión en este momento. Por favor, comunícate con sistemas.",
			);
		} else {
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor.",
			);
		}
		isSubmitting = false;
	}
};
</script>

<div class="user-menu-root" bind:this={menuContainer}>
	<!-- Botón Trigger de Usuario (Avatar Circular Minimalista) -->
	<button
		type="button"
		class="menu-trigger"
		class:active={isOpen}
		onclick={() => (isOpen = !isOpen)}
		aria-haspopup="menu"
		aria-expanded={isOpen}
		aria-label="Menú de usuario"
	>
		<span class="avatar-pill">{initials}</span>
	</button>

	<!-- Menú Flotante Dropdown -->
	{#if isOpen}
		<div
			class="dropdown-popover"
			role="menu"
			tabindex="-1"
			aria-label="Opciones del usuario"
		>
			<!-- Tarjeta de Identidad -->
			<div class="user-identity-card">
				<div class="identity-avatar">{initials}</div>
				<div class="identity-info">
					<span class="identity-name">{user.name}</span>
					<span class="identity-email">{user.email}</span>
					<div class="identity-role-wrap">
						<span class="role-badge" data-role={user.role}>
							{ROLE_LABELS[user.role]}
						</span>
					</div>
				</div>
			</div>

			<div class="dropdown-divider"></div>

			<!-- Navegación de Perfil y Configuración -->
			<nav class="dropdown-links">
				<a
					href={resolve("perfil")}
					class="dropdown-item"
					role="menuitem"
					onclick={() => (isOpen = false)}
				>
					<span class="item-icon"><User size={16} /></span>
					<span>Mi Perfil</span>
				</a>

				{#if isAdmin}
					<a
						href={resolve("configuracion")}
						class="dropdown-item"
						role="menuitem"
						onclick={() => (isOpen = false)}
					>
						<span class="item-icon"><Settings size={16} /></span>
						<span>Configuración</span>
					</a>
				{/if}
			</nav>

			<div class="dropdown-divider"></div>

			<!-- Botón de Cerrar Sesión -->
			<div class="dropdown-footer">
				<button
					type="button"
					class="btn-dropdown-logout"
					role="menuitem"
					onclick={handleLogout}
					disabled={isSubmitting}
					aria-label="Cerrar sesión"
				>
					{#if isSubmitting}
						<LoaderCircle size={15} class="spinner" />
						<span>Cerrando sesión...</span>
					{:else}
						<LogOut size={15} />
						<span>Cerrar Sesión</span>
					{/if}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
.user-menu-root {
	position: relative;
	display: inline-flex;
}

/* ── Trigger del Menú (Avatar Circular) ────────── */
.menu-trigger {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 2px;
	cursor: pointer;

	background-color: transparent;
	border: 2px solid transparent;
	border-radius: 50%;

	transition: all 0.15s ease;

	&:hover,
	&.active {
		border-color: light-dark(oklch(80% 0.05 250), oklch(40% 0.06 250));
	}
}

.avatar-pill {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;

	font-size: 0.82rem;
	font-weight: 750;
	color: light-dark(oklch(38% 0.12 250), oklch(85% 0.1 250));

	background-color: light-dark(oklch(91% 0.03 250), oklch(28% 0.04 260));
	border: 1px solid light-dark(oklch(85% 0.02 250), oklch(34% 0.02 260));
	border-radius: 50%;

	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease;
}

.menu-trigger:hover .avatar-pill,
.menu-trigger.active .avatar-pill {
	box-shadow: 0 2px 8px light-dark(oklch(0% 0 0 / 0.1), oklch(0% 0 0 / 0.3));
	transform: scale(1.04);
}

/* ── Popover Flotante ──────────────────────────── */
.dropdown-popover {
	position: absolute;
	top: calc(100% + 10px);
	right: 0;
	z-index: var(--z-dropdown);

	display: flex;
	flex-direction: column;
	width: 260px;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border: 1px solid light-dark(oklch(90% 0.01 250), oklch(29% 0.015 260));
	border-radius: 14px;
	box-shadow: 0 10px 25px -4px
		light-dark(oklch(0% 0 0 / 0.1), oklch(0% 0 0 / 0.45));
	transform-origin: top right;

	animation: popover-fade 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popover-fade {
	from {
		opacity: 0;
		transform: scale(0.96) translateY(-4px);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

/* ── Tarjeta de Identidad ──────────────────────── */
.user-identity-card {
	display: flex;
	gap: 0.75rem;
	align-items: center;
	padding: 1rem 1.15rem;
}

.identity-avatar {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;

	font-size: 0.95rem;
	font-weight: 800;
	color: light-dark(oklch(38% 0.14 250), oklch(85% 0.12 250));

	background-color: light-dark(oklch(93% 0.03 250), oklch(28% 0.04 260));
	border-radius: 12px;
}

.identity-info {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.15rem;
	min-width: 0;
}

.identity-name {
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 0.88rem;
	font-weight: 700;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	white-space: nowrap;
}

.identity-email {
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 0.76rem;
	color: light-dark(oklch(52% 0.02 255), oklch(70% 0.02 255));
	white-space: nowrap;
}

.identity-role-wrap {
	margin-top: 0.25rem;
}

.role-badge {
	display: inline-flex;
	padding: 0.15rem 0.5rem;
	font-size: 0.65rem;
	font-weight: 750;
	color: light-dark(oklch(35% 0.08 250), oklch(80% 0.08 250));
	text-transform: uppercase;
	letter-spacing: 0.04em;

	background-color: light-dark(oklch(95% 0.01 250), oklch(26% 0.02 260));
	border-radius: 999px;

	&[data-role="ADMIN"] {
		color: light-dark(oklch(42% 0.14 250), oklch(78% 0.12 250));
		background-color: light-dark(oklch(94% 0.03 250), oklch(28% 0.035 250));
	}

	&[data-role="USER"] {
		color: light-dark(oklch(45% 0.12 180), oklch(72% 0.1 180));
		background-color: light-dark(oklch(95.6% 0.02 180), oklch(28% 0.025 180));
	}
}

.dropdown-divider {
	height: 1px;
	background-color: light-dark(oklch(92% 0.01 250), oklch(27% 0.015 260));
}

/* ── Links del Menú ────────────────────────────── */
.dropdown-links {
	display: flex;
	flex-direction: column;
	padding: 0.35rem;
}

.dropdown-item {
	display: flex;
	gap: 0.65rem;
	align-items: center;
	padding: 0.55rem 0.85rem;

	font-size: 0.84rem;
	font-weight: 600;
	color: light-dark(oklch(35% 0.02 255), oklch(88% 0.01 255));
	text-decoration: none;

	border-radius: 8px;
	transition: all 0.12s ease;

	&:hover {
		color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
		background-color: light-dark(oklch(95% 0.01 250), oklch(27% 0.02 260));
	}
}

.item-icon {
	display: flex;
	align-items: center;
	color: light-dark(oklch(55% 0.02 255), oklch(68% 0.02 255));
}

/* ── Footer con Botón Salir ────────────────────── */
.dropdown-footer {
	padding: 0.35rem;
}

.btn-dropdown-logout {
	display: flex;
	gap: 0.65rem;
	align-items: center;
	width: 100%;
	padding: 0.55rem 0.85rem;

	font-size: 0.84rem;
	font-weight: 650;
	color: light-dark(oklch(48% 0.14 25), oklch(75% 0.12 25));
	cursor: pointer;

	background: none;
	border: none;
	border-radius: 8px;

	transition: all 0.12s ease;

	&:hover:not(:disabled) {
		color: light-dark(oklch(38% 0.18 25), oklch(88% 0.14 25));
		background-color: light-dark(oklch(96% 0.02 25), oklch(28% 0.035 25));
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
}

.btn-dropdown-logout :global(.spinner) {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
