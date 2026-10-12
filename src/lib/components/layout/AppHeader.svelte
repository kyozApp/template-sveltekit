<script lang="ts">
import { PanelLeft } from "@lucide/svelte";

import UserMenu from "#lib/components/layout/UserMenu.svelte";
import ThemeToggle from "#lib/components/ui/ThemeToggle.svelte";

interface Props {
	isSidebarOpen: boolean;
}

let { isSidebarOpen = $bindable() }: Props = $props();
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
	</div>

	<div class="header-right">
		<ThemeToggle />
		<div class="divider"></div>
		<UserMenu />
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

.divider {
	width: 1px;
	height: 24px;
	background-color: light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));
}
</style>
