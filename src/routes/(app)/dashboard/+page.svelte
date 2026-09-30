<script lang="ts">
import { resolve } from "$app/paths";
import { page } from "$app/state";

import {
	Activity,
	BookOpen,
	ShieldCheck,
	UserCheck,
	Users,
} from "@lucide/svelte";

const user = $derived(page.data.user);
</script>

<svelte:head>
	<title>Dashboard · Admin Panel</title>
</svelte:head>

<div class="dashboard-container">
	<header class="dashboard-header">
		<div class="welcome-text">
			<h1 class="dashboard-title">¡Bienvenido, {user?.name ?? "Usuario"}!</h1>
			<p class="dashboard-subtitle">
				Panel de control y resumen general del sistema
			</p>
		</div>
		<div class="user-badge" data-role={user?.role}>
			<ShieldCheck size="16" />
			<span>Rol: {user?.role ?? "USUARIO"}</span>
		</div>
	</header>

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon-wrap primary">
				<Users size="22" />
			</div>
			<div class="stat-content">
				<span class="stat-label">Gestión de Acceso</span>
				<span class="stat-value">Usuarios</span>
				<a href={resolve("/usuarios")} class="stat-link">
					Administrar cuentas &rarr;
				</a>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon-wrap success">
				<UserCheck size="22" />
			</div>
			<div class="stat-content">
				<span class="stat-label">Sesión Actual</span>
				<span class="stat-value">{user?.username ?? "activo"}</span>
				<span class="stat-desc">{user?.email ?? ""}</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon-wrap info">
				<Activity size="22" />
			</div>
			<div class="stat-content">
				<span class="stat-label">Estado del Servidor</span>
				<span class="stat-value">Operativo</span>
				<span class="stat-desc">Node.js · SvelteKit · Prisma 8</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon-wrap warning">
				<BookOpen size="22" />
			</div>
			<div class="stat-content">
				<span class="stat-label">Documentación</span>
				<span class="stat-value">Manual</span>
				<a href={resolve("/manual")} class="stat-link">
					Consultar guía &rarr;
				</a>
			</div>
		</div>
	</div>
</div>

<style>
.dashboard-container {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
}

.dashboard-header {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid light-dark(oklch(90% 0.02 255), oklch(27% 0.015 260));
}

.dashboard-title {
	font-size: 1.75rem;
	font-weight: 800;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	letter-spacing: -0.02em;
}

.dashboard-subtitle {
	font-size: 0.95rem;
	color: light-dark(oklch(55% 0.02 255), oklch(75% 0.02 255));
}

.user-badge {
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
	padding: 0.4rem 0.85rem;
	font-size: 0.8rem;
	font-weight: 700;
	color: light-dark(oklch(38% 0.14 250), oklch(74% 0.12 250));
	background-color: light-dark(oklch(95% 0.02 250), oklch(28% 0.03 250));
	border-radius: 999px;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.25rem;
}

.stat-card {
	display: flex;
	gap: 1.25rem;
	align-items: flex-start;
	padding: 1.5rem;
	background-color: light-dark(oklch(100% 0 0), oklch(24% 0.02 260));
	border: 1px solid light-dark(oklch(90% 0.02 255), oklch(28% 0.015 260));
	border-radius: 16px;
	box-shadow: 0 4px 12px light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.15));
}

.stat-icon-wrap {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	border-radius: 12px;

	&.primary {
		color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
		background-color: light-dark(oklch(94% 0.03 250), oklch(30% 0.04 250));
	}

	&.success {
		color: light-dark(oklch(45% 0.14 145), oklch(75% 0.12 145));
		background-color: light-dark(oklch(94% 0.03 145), oklch(30% 0.04 145));
	}

	&.info {
		color: light-dark(oklch(45% 0.14 290), oklch(75% 0.12 290));
		background-color: light-dark(oklch(94% 0.03 290), oklch(30% 0.04 290));
	}

	&.warning {
		color: light-dark(oklch(45% 0.14 70), oklch(75% 0.12 70));
		background-color: light-dark(oklch(94% 0.03 70), oklch(30% 0.04 70));
	}
}

.stat-content {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.stat-label {
	font-size: 0.78rem;
	font-weight: 700;
	color: light-dark(oklch(55% 0.02 255), oklch(70% 0.02 255));
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.stat-value {
	font-size: 1.35rem;
	font-weight: 800;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
}

.stat-desc {
	font-size: 0.85rem;
	color: light-dark(oklch(60% 0.02 255), oklch(75% 0.02 255));
}

.stat-link {
	font-size: 0.85rem;
	font-weight: 600;
	color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
}
</style>
