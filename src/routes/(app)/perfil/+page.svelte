<script lang="ts">
import { fly } from "svelte/transition";

import {
	CircleAlert,
	KeyRound,
	Laptop,
	LoaderCircle,
	User,
} from "@lucide/svelte";

import { ROLE_LABELS } from "#lib/constants.ts";
import { getProfileData } from "#lib/remote/profile/profile.query.remote.ts";

import ProfileInfoForm from "./ProfileInfoForm.svelte";
import ProfilePasswordForm from "./ProfilePasswordForm.svelte";
import ProfileSessionsCard from "./ProfileSessionsCard.svelte";

let activeTab = $state<"info" | "security" | "sessions">("info");

// Cambia la pestaña activa de la vista de perfil
const handleSelectTab = (tab: "info" | "security" | "sessions") => {
	activeTab = tab;
};
</script>

<svelte:head>
	<title>Mi Perfil</title>
</svelte:head>

<div
	class="mx-auto flex w-full max-w-4xl flex-col gap-5 px-3 py-6 pb-12 text-zinc-900 md:gap-7 md:px-5 md:py-6 md:pb-12 dark:text-zinc-100"
	in:fly={{ y: 8, duration: 350 }}
>
	<svelte:boundary>
		{@const profile = await getProfileData()}
		{@const user = profile.user}
		{@const initials = user.name
			.split(" ")
			.map((n) => n[0])
			.filter(Boolean)
			.slice(0, 2)
			.join("")
			.toUpperCase()}

		<!-- Cabecera de Perfil -->
		<header
			class="flex flex-col items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="flex size-17 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-xl font-extrabold tracking-wide text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
			>
				<span>{initials}</span>
			</div>
			<div class="flex min-w-0 flex-1 flex-col gap-1.5">
				<div class="flex flex-wrap items-center gap-3">
					<h1
						class="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
					>
						{user.name}
					</h1>
					<span
						class={[
							"inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold tracking-wider uppercase",
							user.role === "ADMIN"
								? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
								: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
						]}
					>
						{ROLE_LABELS[user.role]}
					</span>
				</div>
				<p
					class="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
				>
					<span class="font-mono font-semibold text-zinc-800 dark:text-zinc-200"
						>@{user.username}</span
					>
					<span class="text-zinc-300 dark:text-zinc-600">•</span>
					<span>{user.email}</span>
				</p>
			</div>
		</header>

		<!-- Barra de Navegación por Pestañas -->
		<div
			class="flex gap-2 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-100 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60"
		>
			<button
				type="button"
				class={[
					"inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
					activeTab === "info"
						? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
						: "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
				]}
				onclick={() => handleSelectTab("info")}
			>
				<User size={16} />
				<span>Información Personal</span>
			</button>
			<button
				type="button"
				class={[
					"inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
					activeTab === "security"
						? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
						: "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
				]}
				onclick={() => handleSelectTab("security")}
			>
				<KeyRound size={16} />
				<span>Seguridad y Contraseña</span>
			</button>
			<button
				type="button"
				class={[
					"inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
					activeTab === "sessions"
						? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
						: "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
				]}
				onclick={() => handleSelectTab("sessions")}
			>
				<Laptop size={16} />
				<span>Sesiones ({profile.sessions.length})</span>
			</button>
		</div>

		<!-- Contenido de la pestaña activa -->
		<main class="flex flex-col">
			{#if activeTab === "info"}
				<div in:fly={{ y: 6, duration: 250 }}>
					<ProfileInfoForm
						initialData={{
							name: user.name,
							username: user.username,
							email: user.email,
						}}
					/>
				</div>
			{:else if activeTab === "security"}
				<div in:fly={{ y: 6, duration: 250 }}>
					<ProfilePasswordForm />
				</div>
			{:else if activeTab === "sessions"}
				<div in:fly={{ y: 6, duration: 250 }}>
					<ProfileSessionsCard sessions={profile.sessions} />
				</div>
			{/if}
		</main>

		{#snippet pending()}
			<div
				class="flex min-h-80 flex-col items-center justify-center gap-2.5 p-8"
			>
				<div
					class="flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
				>
					<LoaderCircle size={24} class="animate-spin" />
				</div>
				<p class="m-0 text-base font-bold text-zinc-900 dark:text-zinc-100">
					Cargando información del perfil...
				</p>
				<p class="m-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
					Por favor espera un momento.
				</p>
			</div>
		{/snippet}

		{#snippet failed()}
			<div
				class="flex min-h-80 flex-col items-center justify-center gap-2.5 p-8"
			>
				<div
					class="flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-red-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-red-400"
				>
					<CircleAlert size={24} />
				</div>
				<p class="m-0 text-base font-bold text-zinc-900 dark:text-zinc-100">
					Error al cargar el perfil
				</p>
				<p class="m-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
					Ocurrió un error al cargar la información. Por favor, recarga la
					página.
				</p>
			</div>
		{/snippet}
	</svelte:boundary>
</div>
