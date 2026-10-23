<script lang="ts">
import { CircleAlert, Eye, EyeOff, Lock } from "@lucide/svelte";

import type { createUser } from "#lib/remote/user/user.form.remote.ts";

interface Props {
	fieldPassword: typeof createUser.fields.password;
	submitting: boolean;
}

let { fieldPassword, submitting }: Props = $props();

let showPassword = $state(false);
</script>

<div class="flex flex-col gap-2">
	<label
		for="user-create-password"
		class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
	>
		Contraseña
	</label>
	<div class="relative flex w-full items-center">
		<span
			class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
		>
			<Lock size={16} />
		</span>
		<input
			{...fieldPassword.as(showPassword ? "text" : "password")}
			id="user-create-password"
			class={[
				"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-11 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
				fieldPassword.issues()?.length && "border-red-500 dark:border-red-400",
			]}
			placeholder="••••••••"
			autocomplete="new-password"
			disabled={submitting}
		>
		<button
			type="button"
			class="absolute right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-zinc-100 p-0 text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
			onclick={() => (showPassword = !showPassword)}
			aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
			disabled={submitting}
		>
			{#if showPassword}
				<EyeOff size={16} />
			{:else}
				<Eye size={16} />
			{/if}
		</button>
	</div>
	{#if fieldPassword.issues()?.length}
		<span
			class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
		>
			<CircleAlert size={14} />
			<span>{fieldPassword.issues()?.[0]?.message}</span>
		</span>
	{/if}
</div>
