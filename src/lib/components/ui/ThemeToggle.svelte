<script lang="ts">
import { Moon, Sun } from "@lucide/svelte";
import { mode, toggleMode } from "mode-watcher";
</script>

<button type="button" onclick={toggleMode} class="theme-toggle-btn">
	{#if mode.current === "dark"}
		<Sun />
	{:else}
		<Moon />
	{/if}
</button>

<style>
.theme-toggle-btn {
	display: flex;
	padding: 4px;
	cursor: pointer;
	background-color: transparent;
	border: none;
	border-radius: 10px;
}
</style>
