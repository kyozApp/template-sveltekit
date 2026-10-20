<script lang="ts">
import { Moon, Sun } from "@lucide/svelte";
import { mode, toggleMode } from "mode-watcher";
</script>

<button
	type="button"
	onclick={toggleMode}
	class="flex cursor-pointer rounded-lg border-none bg-transparent p-1"
>
	{#if mode.current === "dark"}
		<Sun />
	{:else}
		<Moon />
	{/if}
</button>
