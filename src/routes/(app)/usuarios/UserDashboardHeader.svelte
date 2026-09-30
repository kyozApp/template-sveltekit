<script lang="ts">
import { Shield } from "@lucide/svelte";

import UserCreateButton from "./UserCreateButton.svelte";
</script>

<header class="page-header-card">
	<div class="page-header-content">
		<span class="page-header-badge">
			<Shield size={12} />
			Gestión de Accesos
		</span>
		<p class="page-header-subtitle">
			Administra y gestiona los accesos, roles y cuentas del personal
			registrado.
		</p>
	</div>

	<div class="page-header-actions">
		<UserCreateButton />
	</div>
</header>

<style>
.page-header-card {
	display: flex;
	flex-wrap: wrap;
	gap: 1.25rem;
	align-items: center;
	justify-content: space-between;

	padding: 1.4rem 1.5rem;

	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 24px;

	@media (width <= 768px) {
		padding: 1.2rem 1rem;
	}
}

.page-header-content {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.45rem;

	min-width: 240px;
}

.page-header-badge {
	display: inline-flex;
	gap: 0.4rem;
	align-items: center;
	align-self: flex-start;

	font-size: 0.96rem;
	font-weight: 700;
	line-height: 1.25;
	color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.page-header-subtitle {
	max-width: 60ch;
	margin: 0;

	font-size: 0.84rem;
	font-weight: 500;
	line-height: 1.45;
	color: light-dark(oklch(49% 0.008 255), oklch(71% 0.008 255));
}

.page-header-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	align-items: center;
	justify-content: flex-end;

	@media (width <= 768px) {
		justify-content: flex-start;
		width: 100%;
	}
}
</style>
