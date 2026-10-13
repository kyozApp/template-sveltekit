<script lang="ts">
import { fly } from "svelte/transition";
import { resolve } from "$app/paths";
import { page } from "$app/state";

import { BookOpen, Layers, LayoutDashboard, UserCog, X } from "@lucide/svelte";

interface Props {
	isSidebarOpen: boolean;
}

let { isSidebarOpen = $bindable() }: Props = $props();
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
			href={resolve("dashboard")}
			class="brand"
			aria-label="Ir al panel principal"
			in:fly={{ y: 4, duration: 300 }}
		>
			<span class="brand-icon">
				<Layers size={24} />
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
				<X size={20} />
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
			href={resolve("dashboard")}
			class="sidebar-link"
			class:active={page.url.pathname.startsWith("/dashboard")}
			data-tooltip={!isSidebarOpen ? "Dashboard" : undefined}
			data-tooltip-position="right"
			aria-label="Dashboard"
		>
			<span class="sidebar-icon"><LayoutDashboard size={18} /></span>
			{#if isSidebarOpen}
				<span class="sidebar-label">Dashboard</span>
			{/if}
		</a>

		{#if page.data.user?.role === "ADMIN"}
			<a
				href={resolve("usuarios")}
				class="sidebar-link"
				class:active={page.url.pathname.startsWith("/usuarios")}
				data-tooltip={!isSidebarOpen ? "Usuarios" : undefined}
				data-tooltip-position="right"
				aria-label="Usuarios"
			>
				<span class="sidebar-icon"><UserCog size={18} /></span>
				{#if isSidebarOpen}
					<span class="sidebar-label">Usuarios</span>
				{/if}
			</a>
		{/if}

		<a
			href={resolve("manual")}
			class="sidebar-link"
			class:active={page.url.pathname.startsWith("/manual")}
			data-tooltip={!isSidebarOpen ? "Manual" : undefined}
			data-tooltip-position="right"
			aria-label="Manual de Usuario"
		>
			<span class="sidebar-icon"><BookOpen size={18} /></span>
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
}

.mobile-close-btn {
	display: flex;
	align-items: center;
	justify-content: center;

	inline-size: 36px;
	block-size: 36px;
	color: light-dark(oklch(50% 0.02 255), oklch(70% 0.02 255));
	cursor: pointer;

	background: none;
	border: none;
	border-radius: 8px;

	transition: background-color 0.15s ease;

	&:hover {
		background-color: light-dark(oklch(92% 0.01 250), oklch(27% 0.015 260));
	}

	@media (width > 768px) {
		display: none;
	}
}

.sidebar {
	position: sticky;
	top: 0;
	z-index: var(--z-sidebar);

	display: flex;
	flex-shrink: 0;
	flex-direction: column;

	inline-size: 260px;
	block-size: 100dvh;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border-inline-end: 1px solid
		light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));

	transition: inline-size 0.25s cubic-bezier(0.4, 0, 0.2, 1);

	&.collapsed {
		inline-size: 80px;

		.sidebar-brand-container {
			justify-content: center;
			padding: 0;
		}

		.sidebar-link {
			justify-content: center;
			padding: 0.75rem 0;
		}
	}

	@media (width <= 768px) {
		position: fixed;
		left: 0;
		z-index: var(--z-sidebar-floating);
		transform: translateX(0);
		transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

		&.collapsed {
			inline-size: 260px;
			transform: translateX(-100%);
		}
	}
}

.menu-category {
	padding: 1.5rem 1.5rem 0.5rem;

	font-size: 0.7rem;
	font-weight: 700;
	color: light-dark(oklch(60% 0.02 255), oklch(65% 0.02 255));
	letter-spacing: 0.08em;
}

.sidebar-nav {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	padding: 0.75rem;
}

.sidebar-link {
	position: relative;

	display: flex;
	gap: 0.85rem;
	align-items: center;

	padding: 0.75rem 1rem;

	font-size: 0.9rem;
	font-weight: 600;
	color: light-dark(oklch(50% 0.02 255), oklch(75% 0.02 255));
	text-decoration: none;

	border-radius: 12px;

	transition:
		background-color 0.15s ease,
		color 0.15s ease;

	&:hover {
		color: light-dark(oklch(20% 0.02 255), oklch(95% 0.01 255));
		background-color: light-dark(oklch(95% 0.01 250), oklch(26% 0.02 260));
	}

	&.active {
		color: light-dark(oklch(40% 0.14 250), oklch(85% 0.12 250));
		background-color: light-dark(oklch(94% 0.03 250), oklch(27% 0.035 260));
	}
}

.sidebar-icon {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
}

.sidebar-label {
	white-space: nowrap;
}
</style>
