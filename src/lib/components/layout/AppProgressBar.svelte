<script lang="ts">
import { navigating } from "$app/state";
</script>

{#if navigating.to}
	<div class="global-progress-bar">
		<div class="progress-bar-fill"></div>
	</div>
{/if}

<style>
.global-progress-bar {
	position: fixed;
	top: 0;
	left: 0;
	z-index: var(--z-imperative);

	width: 100%;
	height: 3px;

	background-color: light-dark(
		oklch(42% 0.14 250 / 0.2),
		oklch(74% 0.12 250 / 0.2)
	);
}

.progress-bar-fill {
	width: 100%;
	height: 100%;

	background-color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
	transform-origin: 0% 50%;

	animation: loading-bar-2s-loop-progress-bar-fill 2s infinite ease-in-out;
}

@keyframes loading-bar-2s-loop-progress-bar-fill {
	0% {
		transform: scaleX(0);
	}

	50% {
		transform: scaleX(0.7);
	}

	100% {
		transform: scaleX(0);
	}
}
</style>
