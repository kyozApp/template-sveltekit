<script lang="ts">
import { PanelLeft } from "@lucide/svelte";

import UserMenu from "#lib/components/layout/UserMenu.svelte";
import ThemeToggle from "#lib/components/ui/ThemeToggle.svelte";
import type { SessionUser } from "#lib/constants.ts";

interface Props {
	isSidebarOpen: boolean;
	user: SessionUser;
}

let { isSidebarOpen = $bindable(), user }: Props = $props();
</script>

<header
	class="sticky top-0 z-30 flex h-17.5 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-5 md:px-8 dark:border-zinc-800 dark:bg-zinc-900"
>
	<div class="flex items-center gap-6">
		<button
			type="button"
			class="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-transparent text-zinc-500 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
			onclick={() => (isSidebarOpen = !isSidebarOpen)}
			aria-label={isSidebarOpen ? "Colapsar sidebar" : "Expandir sidebar"}
			aria-expanded={isSidebarOpen}
		>
			<PanelLeft size={20} />
		</button>
	</div>

	<div class="flex items-center gap-5">
		<ThemeToggle />
		<div class="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>
		<UserMenu {user} />
	</div>
</header>
