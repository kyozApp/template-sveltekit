<script lang="ts">
import { fly } from "svelte/transition";
import { goto } from "$app/navigation";
import { page } from "$app/state";

import { Shield, UserPlus } from "@lucide/svelte";

import UserModals from "./UserModals.svelte";
import UserTable from "./UserTable.svelte";

let { data } = $props();

// Abre el modal para crear un nuevo usuario mediante navegación superficial
const handleOpenCreateModal = () => {
	goto("", {
		shallow: true,
		state: {
			...page.state,
			showUserCreate: { isOpen: true },
		},
	});
};
</script>

<svelte:head>
	<title>Usuarios</title>
</svelte:head>

<div
	class="flex w-full flex-col gap-6 px-2 py-3 pb-8 text-zinc-900 md:gap-8 md:px-5 md:py-5 md:pb-10 dark:text-zinc-100"
	in:fly={{ y: 8, duration: 350 }}
>
	<header
		class="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-zinc-200 bg-white p-4 md:px-6 md:py-5 dark:border-zinc-800 dark:bg-zinc-900"
	>
		<div class="flex min-w-60 flex-1 flex-col gap-1.5">
			<span
				class="inline-flex items-center gap-1.5 self-start text-sm font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
			>
				<Shield size={14} />
				Gestión de Accesos
			</span>
			<p
				class="m-0 max-w-xl text-xs leading-relaxed font-medium text-zinc-500 dark:text-zinc-400"
			>
				Administra y gestiona los accesos, roles y cuentas del personal
				registrado.
			</p>
		</div>

		<div
			class="flex w-full flex-wrap items-center justify-start gap-3 md:w-auto md:justify-end"
		>
			<button
				type="button"
				onclick={handleOpenCreateModal}
				class="inline-flex w-full min-w-44 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-5 py-3 text-sm font-bold tracking-wide text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-900 md:w-auto dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
			>
				<UserPlus size={18} />
				<span>Nuevo Usuario</span>
			</button>
		</div>
	</header>

	<div
		class="m-0 flex w-full max-w-full flex-col gap-6 px-0 pt-2 pb-8 text-zinc-900 dark:text-zinc-100"
	>
		<UserTable currentUser={data.user} />
	</div>
</div>

<UserModals currentUserId={data.user.id} />
