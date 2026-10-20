<script lang="ts">
let { children } = $props();
</script>

<div
	class="flex min-h-dvh w-full flex-col overflow-x-hidden bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100"
>
	{@render children()}
</div>
