<script lang="ts">
import { fly } from "svelte/transition";
import { resolve } from "$app/paths";
import { page } from "$app/state";

import { CircleAlert, House } from "@lucide/svelte";
</script>

<div class="error-page">
	<div class="error-card" in:fly={{ y: 10, duration: 400 }}>
		<div class="icon-container">
			<CircleAlert size="48" />
		</div>

		<h1 class="error-code">{page.status}</h1>

		<h2 class="error-title">
			{#if page.status === 404}
				Página No Encontrada
			{:else}
				Ha Ocurrido un Error
			{/if}
		</h2>

		<p class="error-message">
			{#if page.status === 404}
				Lo sentimos, la página que buscas no existe o ha sido movida.
			{:else}
				Ocurrió un error interno en el servidor.
			{/if}
		</p>

		<a href={resolve("")} class="btn-home">
			<House size="18" />
			<span>Volver al Inicio</span>
		</a>
	</div>
</div>

<style>
.error-page {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100dvh;
	padding: 1.5rem;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	background-color: light-dark(oklch(98% 0.01 255), oklch(18% 0.03 255));
}

.error-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 480px;
	padding: 3rem 2rem;
	text-align: center;
	background-color: light-dark(oklch(100% 0 0), oklch(25% 0.03 255));
	border: 1px solid light-dark(oklch(90% 0.02 255), oklch(35% 0.03 255));
	border-radius: 16px;
	box-shadow: 0 10px 30px oklch(0% 0 0 / 0.05);
}

.icon-container {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80px;
	height: 80px;
	margin-bottom: 1.5rem;
	background-color: oklch(from oklch(62% 0.25 35) l c h / 0.1);
	border-radius: 50%;
}

.error-code {
	margin-bottom: 0.5rem;

	font-size: 6rem;
	font-weight: 950;
	line-height: 1;

	-webkit-text-fill-color: transparent;
	letter-spacing: -0.05em;

	background: linear-gradient(
		135deg,
		light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255)) 30%,
		light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255)) 100%
	);
	background-clip: text;
}

.error-title {
	margin-bottom: 1rem;

	font-size: 1.5rem;
	font-weight: 800;
}

.error-message {
	margin-bottom: 2rem;

	font-size: 0.95rem;
	line-height: 1.6;
	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
}

.btn-home {
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;

	padding: 0.75rem 1.5rem;

	font-size: 0.95rem;
	font-weight: 600;
	color: oklch(100% 0 0);
	text-decoration: none;

	background-color: light-dark(oklch(52% 0.14 205), oklch(60% 0.14 205));
	border-radius: 12px;
	box-shadow: 0 4px 12px
		oklch(
			from light-dark(oklch(52% 0.14 205), oklch(61.655% 0.10654 209.681)) l c h /
			0.2
		);

	transition: all 0.2s ease;

	&:hover {
		background-color: oklch(44% 0.14 205);
		box-shadow: 0 6px 16px
			oklch(
				from light-dark(oklch(52% 0.14 205), oklch(60% 0.14 205)) l c h /
				0.3
			);
		transform: translateY(-1px);
	}
}
</style>
