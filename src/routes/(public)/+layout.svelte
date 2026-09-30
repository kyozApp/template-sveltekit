<script lang="ts">
let { children } = $props();
</script>

<div class="app-layout">
	{@render children()}
</div>

<style>
.app-layout {
	display: flex;
	flex-direction: column;

	width: 100%;
	min-height: 100dvh;
	overflow-x: hidden;

	color: light-dark(
		oklch(20.239% 0.01855 255.762 / 0.829),
		oklch(98% 0.01 255)
	);

	background-color: light-dark(oklch(98% 0.01 255), oklch(18% 0.03 255));
}
</style>
