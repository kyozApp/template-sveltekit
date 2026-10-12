<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { fly } from "svelte/transition";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

import { KeyRound, Laptop, User } from "@lucide/svelte";

import { getProfileData } from "#lib/remote/profile/profile.query.remote.ts";

import UserRoleCell from "../usuarios/UserRoleCell.svelte";
import ProfileInfoForm from "./ProfileInfoForm.svelte";
import ProfilePasswordForm from "./ProfilePasswordForm.svelte";
import ProfileSessionsCard from "./ProfileSessionsCard.svelte";

let activeTab = $state<"info" | "security" | "sessions">("info");

const onBoundaryError = (err: unknown) => {
	if (isHttpError(err) && err.status === 401) {
		void goto(resolve("iniciar-sesion"));
	}
};
</script>

<svelte:head>
	<title>Mi Perfil</title>
</svelte:head>

<div class="profile-container" in:fly={{ y: 8, duration: 350 }}>
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
		<header class="profile-header">
			<div class="avatar-wrap">
				<span class="avatar-text">{initials}</span>
			</div>
			<div class="user-meta">
				<div class="name-row">
					<h1 class="user-full-name">{user.name}</h1>
					<UserRoleCell role={user.role} />
				</div>
				<p class="user-identifiers">
					<span class="mono">@{user.username}</span>
					<span class="dot">•</span>
					<span>{user.email}</span>
				</p>
			</div>
		</header>

		<!-- Barra de Navegación por Pestañas -->
		<div class="tabs-bar">
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === "info"}
				onclick={() => (activeTab = "info")}
			>
				<User size={16} />
				<span>Información Personal</span>
			</button>
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === "security"}
				onclick={() => (activeTab = "security")}
			>
				<KeyRound size={16} />
				<span>Seguridad y Contraseña</span>
			</button>
			<button
				type="button"
				class="tab-btn"
				class:active={activeTab === "sessions"}
				onclick={() => (activeTab = "sessions")}
			>
				<Laptop size={16} />
				<span>Sesiones ({profile.sessions.length})</span>
			</button>
		</div>

		<!-- Contenido de la pestaña activa -->
		<main class="tab-content">
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

		{#snippet failed(
			error,
		)}
			{@const _ = onBoundaryError(error)}
			<div class="error-container">
				<p>Ocurrió un error al cargar la información del perfil.</p>
				<p class="error-detail">
					{isHttpError(error)
						? error.body.message
						: error instanceof Error
							? error.message
							: "Por favor, recarga la página o inicia sesión nuevamente."}
				</p>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<style>
.profile-container {
	display: flex;
	flex-direction: column;
	gap: 1.75rem;
	width: 100%;
	max-width: 920px;
	padding: 1.5rem 1.25rem 3rem;
	margin: 0 auto;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));

	@media (width <= 768px) {
		gap: 1.25rem;
		padding: 1rem 0.75rem 2.5rem;
	}
}

.profile-header {
	display: flex;
	gap: 1.25rem;
	align-items: center;
	padding: 1.5rem 1.75rem;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border: 1px solid light-dark(oklch(91% 0.01 250), oklch(27% 0.015 260));
	border-radius: 16px;
	box-shadow: 0 4px 20px -2px
		light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.2));

	@media (width <= 640px) {
		flex-direction: column;
		gap: 1rem;
		align-items: flex-start;
		padding: 1.25rem;
	}
}

.avatar-wrap {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 68px;
	height: 68px;

	font-size: 1.35rem;
	font-weight: 800;
	color: light-dark(oklch(40% 0.15 250), oklch(85% 0.12 250));
	letter-spacing: 0.04em;

	background: linear-gradient(
		135deg,
		light-dark(oklch(93% 0.03 250), oklch(26% 0.05 250)),
		light-dark(oklch(90% 0.05 250), oklch(30% 0.08 250))
	);
	border: 2px solid light-dark(oklch(85% 0.06 250), oklch(38% 0.07 250));
	border-radius: 18px;
}

.user-meta {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.35rem;
	min-width: 0;
}

.name-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	align-items: center;
}

.user-full-name {
	font-size: 1.35rem;
	font-weight: 800;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	letter-spacing: -0.01em;
}

.user-identifiers {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
	align-items: center;
	font-size: 0.88rem;
	color: light-dark(oklch(50% 0.02 255), oklch(72% 0.02 255));
}

.mono {
	font-family: var(--font-mono, monospace);
	font-weight: 600;
	color: light-dark(oklch(38% 0.08 250), oklch(78% 0.08 250));
}

.dot {
	color: light-dark(oklch(75% 0.01 250), oklch(45% 0.01 250));
}

/* ── Tabs Bar ────────────────────────────────────────────────────────── */
.tabs-bar {
	display: flex;
	gap: 0.5rem;
	padding: 0.35rem;
	overflow-x: auto;

	background-color: light-dark(oklch(94.5% 0.008 250), oklch(23% 0.018 260));
	border: 1px solid light-dark(oklch(89% 0.01 250), oklch(28% 0.015 260));
	border-radius: 12px;
}

.tab-btn {
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
	padding: 0.6rem 1rem;

	font-size: 0.86rem;
	font-weight: 650;
	color: light-dark(oklch(50% 0.02 255), oklch(72% 0.02 255));
	white-space: nowrap;
	cursor: pointer;

	background: none;
	border: none;
	border-radius: 9px;

	transition: all 0.15s ease;

	&:hover:not(.active) {
		color: light-dark(oklch(20% 0.02 255), oklch(95% 0.01 255));
		background-color: light-dark(oklch(91% 0.01 250), oklch(27% 0.018 260));
	}

	&.active {
		color: light-dark(oklch(25% 0.08 250), oklch(98% 0.01 255));
		background-color: light-dark(oklch(100% 0 0), oklch(29% 0.025 260));
		box-shadow: 0 1px 4px light-dark(oklch(0% 0 0 / 0.06), oklch(0% 0 0 / 0.25));
	}
}

.tab-content {
	display: flex;
	flex-direction: column;
}

.error-container {
	padding: 2rem;
	color: light-dark(oklch(50% 0.16 25), oklch(75% 0.12 25));
	text-align: center;
	background-color: light-dark(oklch(96% 0.02 25), oklch(25% 0.03 25));
	border-radius: 12px;
}

.error-detail {
	margin-top: 0.5rem;
	font-size: 0.8rem;
	opacity: 0.8;
}
</style>
