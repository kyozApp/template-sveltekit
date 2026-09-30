<script lang="ts">
import AuthLoginCard from "./AuthLoginCard.svelte";
</script>

<svelte:head>
	<title>Iniciar Sesión</title>
</svelte:head>

<main class="login-container">
	<AuthLoginCard />
</main>

<style>
.login-container {
	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	min-height: 100dvh;
	padding: 1.5rem;

	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));

	background-color: light-dark(oklch(96% 0.004 248), oklch(14% 0.02 255));

	transition:
		background-color 0.25s ease,
		color 0.25s ease;
}
</style>
