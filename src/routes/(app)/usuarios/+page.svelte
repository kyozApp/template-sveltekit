<script lang="ts">
import { fly } from "svelte/transition";

import UserDashboard from "./UserDashboard.svelte";
import UserDashboardHeader from "./UserDashboardHeader.svelte";

let { data } = $props();
</script>

<svelte:head>
	<title>Usuarios</title>
</svelte:head>

<div class="dashboard-container" in:fly={{ y: 8, duration: 350 }}>
	<UserDashboardHeader />
	<UserDashboard currentUserRole={data.user.role} />
</div>

<style>
.dashboard-container {
	display: flex;
	flex-direction: column;
	gap: 2rem;

	width: 100%;
	padding: 1.25rem 1.25rem 2.5rem;

	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));

	@media (width <= 768px) {
		gap: 1.5rem;
		padding: 0.75rem 0.5rem 2rem;
	}
}
</style>
