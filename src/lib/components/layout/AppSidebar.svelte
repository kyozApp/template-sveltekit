<script lang="ts">
import { fly } from "svelte/transition";
import { resolve } from "$app/paths";
import { page } from "$app/state";

import { BookOpen, Layers, LayoutDashboard, UserCog, X } from "@lucide/svelte";

interface Props {
	isSidebarOpen?: boolean;
}

let { isSidebarOpen = $bindable(true) }: Props = $props();
</script>

{#if isSidebarOpen}
	<button
		type="button"
		class="sidebar-overlay"
		onclick={() => (isSidebarOpen = false)}
		tabindex="-1"
		aria-hidden="true"
	></button>
{/if}

<aside class="sidebar" class:collapsed={!isSidebarOpen}>
	<div class="sidebar-brand-container">
		<a
			href={resolve("/dashboard")}
			class="brand"
			in:fly={{ y: 4, duration: 300 }}
		>
			<span class="brand-icon">
				<Layers size="24" />
			</span>
			{#if isSidebarOpen}
				<span class="brand-name">ADMIN PANEL</span>
			{/if}
		</a>
		{#if isSidebarOpen}
			<button
				type="button"
				class="mobile-close-btn"
				onclick={() => (isSidebarOpen = false)}
				aria-label="Cerrar menú"
			>
				<X size="20" />
			</button>
		{/if}
	</div>

	{#if isSidebarOpen}
		<div class="menu-category" in:fly={{ y: 4, duration: 300 }}>
			MENÚ PRINCIPAL
		</div>
	{/if}

	<nav class="sidebar-nav">
		<a
			href={resolve("/dashboard")}
			class="sidebar-link"
			class:active={page.url.pathname.startsWith("/dashboard")}
			data-tooltip={!isSidebarOpen ? "Dashboard" : undefined}
			data-tooltip-position="right"
			aria-label="Dashboard"
		>
			<span class="sidebar-icon"><LayoutDashboard size="18" /></span>
			{#if isSidebarOpen}
				<span class="sidebar-label">Dashboard</span>
			{/if}
		</a>

		{#if page.data.user?.role === "SUPERADMIN" || page.data.user?.role === "ADMIN"}
			<a
				href={resolve("/usuarios")}
				class="sidebar-link"
				class:active={page.url.pathname.startsWith("/usuarios")}
				data-tooltip={!isSidebarOpen ? "Usuarios" : undefined}
				data-tooltip-position="right"
				aria-label="Usuarios"
			>
				<span class="sidebar-icon"><UserCog size="18" /></span>
				{#if isSidebarOpen}
					<span class="sidebar-label">Usuarios</span>
				{/if}
			</a>
		{/if}

		<a
			href={resolve("/manual")}
			class="sidebar-link"
			class:active={page.url.pathname.startsWith("/manual")}
			data-tooltip={!isSidebarOpen ? "Manual" : undefined}
			data-tooltip-position="right"
			aria-label="Manual de Usuario"
		>
			<span class="sidebar-icon"><BookOpen size="18" /></span>
			{#if isSidebarOpen}
				<span class="sidebar-label">Manual</span>
			{/if}
		</a>
	</nav>
</aside>

<style>
.sidebar-overlay {
	position: fixed;
	inset: 0;
	z-index: var(--z-sidebar);
	cursor: pointer;

	background-color: light-dark(oklch(0% 0 0 / 0.4), oklch(0% 0 0 / 0.6));

	border: none;
	backdrop-filter: blur(4px);

	transition: opacity 0.2s ease;

	@media (width > 768px) {
		display: none;
	}
}

.sidebar-brand-container {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: space-between;

	block-size: 70px;
	padding: 0 1.5rem;
	border-block-end: 1px solid
		light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));
}

.brand {
	display: flex;
	gap: 0.75rem;
	align-items: center;

	text-decoration: none;
}

.brand-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
}

.brand-name {
	font-size: 1.1rem;
	font-weight: 800;

	-webkit-text-fill-color: transparent;
	letter-spacing: 0.05em;
	white-space: nowrap;

	background: linear-gradient(
		135deg,
		light-dark(oklch(20% 0.02 255), oklch(91% 0.008 260)) 30%,
		light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255)) 100%
	);
	background-clip: text;

	@media (width <= 768px) {
		font-size: 1rem;
	}
}

.mobile-close-btn {
	display: flex;
	align-items: center;
	justify-content: center;

	padding: 0.25rem;

	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
	cursor: pointer;

	background: transparent;
	border: none;

	@media (width > 768px) {
		display: none;
	}
}

.menu-category {
	flex-shrink: 0;

	padding: 1.75rem 1.5rem 0.5rem;

	font-size: 0.72rem;
	font-weight: 700;
	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
	text-transform: uppercase;
	letter-spacing: 0.1em;
	user-select: none;
}

.sidebar-nav {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.35rem;

	padding: 0.5rem 0.75rem;
	overflow-x: hidden;
	overflow-y: auto;
}

.sidebar-link {
	display: flex;
	gap: 0.875rem;
	align-items: center;

	padding: 0.75rem 1rem;

	font-size: 0.925rem;
	font-weight: 600;
	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
	white-space: nowrap;
	text-decoration: none;
	user-select: none;
	border-radius: 12px;

	transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

	&:not(.disabled):hover {
		color: light-dark(oklch(20% 0.02 255), oklch(91% 0.008 260));
		background-color: light-dark(oklch(0% 0 0 / 0.04), oklch(100% 0 0 / 0.04));
	}

	&.active {
		font-weight: 700;
		color: light-dark(oklch(38% 0.14 250), oklch(74% 0.12 250));

		background-color: light-dark(
			oklch(42% 0.14 250 / 0.08),
			oklch(74% 0.12 250 / 0.12)
		);
	}
}

.sidebar-icon {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
}

.sidebar-label {
	overflow: hidden;
	text-overflow: ellipsis;
}

.sidebar {
	position: sticky;
	inset-block-start: 0;
	z-index: var(--z-sidebar-floating);
	display: flex;
	flex-shrink: 0;
	flex-direction: column;

	inline-size: 260px;
	block-size: 100dvh;
	min-block-size: 100dvh;

	overflow: hidden;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border-inline-end: 1px solid
		light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));

	transition:
		inline-size 0.25s cubic-bezier(0.4, 0, 0.2, 1),
		transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

	&.collapsed {
		inline-size: 80px;
		overflow: visible;
	}

	@media (width <= 768px) {
		position: fixed;
		inset-block-start: 0;
		inset-inline-start: 0;

		inline-size: 280px;
		transform: translateX(0);

		&.collapsed {
			inline-size: 280px;
			overflow: hidden;
			transform: translateX(-100%);
		}
	}
}

.sidebar.collapsed .sidebar-brand-container {
	justify-content: center;
	padding: 1.25rem 0;
}

.sidebar.collapsed .sidebar-nav {
	padding: 0.5rem;
	overflow: visible;
}

.sidebar.collapsed .sidebar-link {
	justify-content: center;
	padding: 0.75rem 0;
}

.sidebar.collapsed .menu-category {
	display: none;
}
</style>
