<script lang="ts">
import { fly } from "svelte/transition";

import logo from "#lib/assets/favicon.svg";
import ThemeToggle from "#lib/components/ui/ThemeToggle.svelte";

import AuthLoginForm from "./AuthLoginForm.svelte";
</script>

<div class="login-card" in:fly={{ y: 8, duration: 300 }}>
	<div class="theme-toggle-floating">
		<ThemeToggle />
	</div>

	<header class="login-header">
		<div class="logo-wrapper">
			<img src={logo} alt="Logo de la aplicación" class="app-logo">
		</div>

		<div class="text-group">
			<h1 class="login-title">Iniciar Sesión</h1>
			<p class="login-subtitle">
				Ingresa tus credenciales para acceder al sistema
			</p>
		</div>
	</header>

	<div class="login-body">
		<AuthLoginForm />
	</div>
</div>

<style>
.login-card {
	position: relative;

	width: 100%;
	max-width: 420px;
	padding: 2.75rem 2.25rem 2.25rem;

	background-color: light-dark(oklch(100% 0 0), oklch(24.94% 0.0304 256.86));
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(34% 0.02 256.86));
	border-radius: 24px;
	box-shadow:
		0 24px 48px -12px oklch(0% 0 0 / 0.08),
		0 2px 6px 0 oklch(0% 0 0 / 0.03);

	transition:
		background-color 0.25s ease,
		border-color 0.25s ease,
		box-shadow 0.25s ease;

	@media (width < 640px) {
		padding: 2.25rem 1.5rem 1.75rem;
		border-radius: 20px;
	}
}

.theme-toggle-floating {
	position: absolute;
	top: 1.25rem;
	right: 1.25rem;
}

.login-header {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	align-items: center;

	margin-bottom: 2rem;

	text-align: center;
}

.logo-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;

	min-height: 52px;
}

.app-logo {
	width: auto;
	max-width: 180px;
	height: 48px;

	object-fit: contain;

	transition: transform 0.2s ease;

	@media (width < 640px) {
		max-width: 150px;
		height: 42px;
	}
}

.text-group {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	align-items: center;
}

.login-title {
	margin: 0;

	font-size: 1.45rem;
	font-weight: 800;
	line-height: 1.2;
	color: light-dark(oklch(20% 0.012 255), oklch(98% 0.004 255));
	letter-spacing: -0.025em;

	@media (width < 640px) {
		font-size: 1.3rem;
	}
}

.login-subtitle {
	max-width: 32ch;
	margin: 0;

	font-size: 0.875rem;
	font-weight: 450;
	line-height: 1.45;
	color: light-dark(oklch(52% 0.01 255), oklch(72% 0.012 255));
}

.login-body {
	display: flex;
	flex-direction: column;
}
</style>
