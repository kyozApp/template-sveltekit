<script lang="ts">
import { pushState } from "$app/navigation";
import { page } from "$app/state";

import { Pencil } from "@lucide/svelte";

interface Props {
	userId: string;
}

let { userId }: Props = $props();
</script>

<button
	type="button"
	class="edit-btn"
	onclick={() =>
	pushState("", {
		...page.state,
		showUserUpdate: { isOpen: true, data: { userId } },
	})}
	aria-label="Editar usuario"
	data-tooltip="Editar usuario"
	data-tooltip-position="top-end"
>
	<Pencil size="16" />
</button>

<style>
.edit-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	inline-size: 38px;
	block-size: 38px;
	padding: 0;

	color: light-dark(oklch(37% 0.02 245), oklch(75% 0.02 255));
	cursor: pointer;

	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(27.5% 0.032 256.86)
	);
	border: 1px solid light-dark(oklch(87% 0.008 245), oklch(27% 0.015 260));
	border-radius: 12px;

	transition:
		color 0.18s ease,
		border-color 0.18s ease,
		background-color 0.18s ease;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	&:hover {
		color: light-dark(oklch(38% 0.12 250), oklch(80% 0.12 250));

		background-color: light-dark(oklch(95% 0.025 250), oklch(26% 0.035 250));
		border-color: light-dark(oklch(85% 0.045 250), oklch(36% 0.045 250));
	}
}
</style>
