<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/state";

import { UserPlus } from "@lucide/svelte";
</script>

<button
	type="button"
	onclick={() =>
	goto("", {
		shallow: true,
		state: {
			...page.state,
			showUserCreate: { isOpen: true },
		},
	})}
	class="btn-create-form"
>
	<UserPlus size="20" />
	<span>Nuevo Usuario</span>
</button>

<style>
.btn-create-form {
	display: inline-flex;
	gap: 0.55rem;
	align-items: center;
	justify-content: center;

	min-inline-size: 174px;
	padding: 0.9rem 1.2rem;

	font-size: 0.94rem;
	font-weight: 700;
	color: light-dark(oklch(40% 0.0096 252.81), oklch(75% 0.02 255));
	letter-spacing: 0.005em;
	cursor: pointer;

	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(31.5% 0.04 256.86)
	);
	border: 1px solid light-dark(oklch(84% 0.018 236), oklch(27% 0.015 260));
	border-radius: 14px;

	transition:
		color 0.18s ease,
		background-color 0.18s ease,
		border-color 0.18s ease;

	&:hover {
		color: light-dark(oklch(38% 0.12 250), oklch(80% 0.12 250));
		background-color: light-dark(oklch(95% 0.025 250), oklch(26% 0.035 250));
		border-color: light-dark(oklch(85% 0.045 250), oklch(36% 0.045 250));
	}

	@media (width <= 768px) {
		inline-size: 100%;
		min-inline-size: 0;
	}
}
</style>
