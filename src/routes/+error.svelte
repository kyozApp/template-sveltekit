<script lang="ts">
import { fly } from "svelte/transition";
import { resolve } from "$app/paths";
import { page } from "$app/state";

import { CircleAlert, House } from "@lucide/svelte";
</script>

<div
	class="flex min-h-dvh items-center justify-center bg-zinc-50 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
>
	<div
		class="flex w-full max-w-md flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg sm:p-10 dark:border-zinc-800 dark:bg-zinc-900"
		in:fly={{ y: 10, duration: 400 }}
	>
		<div
			class="mb-6 flex size-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
		>
			<CircleAlert size={48} />
		</div>

		<h1
			class="mb-2 bg-linear-to-br from-zinc-900 to-zinc-500 bg-clip-text text-8xl font-black tracking-tight text-transparent dark:from-zinc-100 dark:to-zinc-500"
		>
			{page.status}
		</h1>

		<h2 class="mb-3 text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
			{#if page.status === 404}
				Página No Encontrada
			{:else}
				Ha Ocurrido un Error
			{/if}
		</h2>

		<p class="mb-8 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
			{#if page.status === 404}
				Lo sentimos, la página que buscas no existe o ha sido movida.
			{:else}
				Ocurrió un error interno en el servidor.
			{/if}
		</p>

		<a
			href={resolve("")}
			class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:border-blue-700 hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-600 dark:hover:border-blue-600 dark:hover:bg-blue-500"
		>
			<House size={18} />
			<span>Volver al Inicio</span>
		</a>
	</div>
</div>
