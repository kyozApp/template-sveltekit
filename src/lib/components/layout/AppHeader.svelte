<script lang="ts">
import { page } from "$app/state";

import { ChevronRight, PanelLeft } from "@lucide/svelte";

import AuthLogout from "#lib/components/auth/AuthLogoutButton.svelte";
import ThemeToggle from "#lib/components/ui/ThemeToggle.svelte";

interface Props {
	isSidebarOpen?: boolean;
}

let { isSidebarOpen = $bindable(true) }: Props = $props();

interface BreadcrumbItem {
	label: string;
	href: string;
	active: boolean;
}

const breadcrumbs = $derived.by<BreadcrumbItem[]>(() => {
	const path = page.url.pathname;

	// Si estamos en la raíz del panel (/dashboard), solo mostramos Dashboard activo
	if (path === "/dashboard") {
		return [{ label: "DASHBOARD", href: "/dashboard", active: true }];
	}

	// Para cualquier otra ruta, la raíz es Dashboard (clicable para volver)
	const items: BreadcrumbItem[] = [
		{ label: "DASHBOARD", href: "/dashboard", active: false },
	];

	// Segmentos de la URL excluyendo 'dashboard' para evitar duplicados
	const segments = path.split("/").filter((s) => s && s !== "dashboard");
	let accumulatedPath = "";

	segments.forEach((segment, index) => {
		accumulatedPath += `/${segment}`;
		const isLast = index === segments.length - 1;

		const label =
			isLast && page.data.title
				? page.data.title.toUpperCase()
				: segment.toUpperCase().replace(/-/g, " ");

		items.push({
			label,
			href: accumulatedPath,
			active: isLast,
		});
	});

	return items;
});
</script>

<header class="app-header">
	<div class="header-left">
		<button
			type="button"
			class="sidebar-toggle"
			onclick={() => (isSidebarOpen = !isSidebarOpen)}
			aria-label={isSidebarOpen ? "Colapsar sidebar" : "Expandir sidebar"}
			aria-expanded={isSidebarOpen}
		>
			<PanelLeft size="20" />
		</button>

		<div class="breadcrumbs">
			{#each breadcrumbs as item, idx (item.href)}
				{#if idx > 0}
					<span class="breadcrumb-separator">
						<ChevronRight size="14" />
					</span>
				{/if}
				{#if item.active}
					<span class="breadcrumb-item active">{item.label}</span>
				{:else}
					<a href={item.href} class="breadcrumb-item link">{item.label}</a>
				{/if}
			{/each}
		</div>
	</div>

	<div class="header-right">
		<ThemeToggle />
		<div class="divider"></div>
		<AuthLogout />
	</div>
</header>

<style>
.app-header {
	position: sticky;
	top: 0;
	z-index: var(--z-sticky);

	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: space-between;

	height: 70px;
	padding: 0 2rem;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border-bottom: 1px solid light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));

	@media (width <= 768px) {
		padding: 0 1.25rem;
	}
}

.header-left {
	display: flex;
	gap: 1.5rem;
	align-items: center;
}

.header-right {
	display: flex;
	gap: 1.25rem;
	align-items: center;
}

.sidebar-toggle {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;

	width: 40px;
	height: 40px;

	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
	cursor: pointer;

	background: none;
	border: 1px solid light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));
	border-radius: 10px;

	transition: all 0.15s ease;

	&:hover {
		color: light-dark(oklch(20% 0.02 255), oklch(91% 0.008 260));

		background-color: light-dark(oklch(95% 0.01 250), oklch(100% 0 0 / 0.04));
		border-color: light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));
	}
}

.breadcrumbs {
	display: flex;
	gap: 0.5rem;
	align-items: center;

	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	user-select: none;

	@media (width <= 768px) {
		display: none;
	}
}

.breadcrumb-item {
	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
	text-transform: uppercase;
	white-space: nowrap;
	text-decoration: none;
	transition: color 0.15s ease;

	&.link:hover {
		color: light-dark(oklch(20% 0.02 255), oklch(91% 0.008 260));
	}

	&.active {
		color: light-dark(oklch(20% 0.02 255), oklch(91% 0.008 260));
	}
}

.breadcrumb-separator {
	display: flex;
	flex-shrink: 0;
	align-items: center;

	color: light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));
}

.divider {
	width: 1px;
	height: 24px;

	background-color: light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));
}
</style>
