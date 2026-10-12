<script lang="ts">
import { fly } from "svelte/transition";

import {
	Activity,
	Clock,
	Cpu,
	Database,
	Layers,
	Lock,
	Server,
	Settings,
	ShieldCheck,
} from "@lucide/svelte";

let activeTab = $state<"general" | "security" | "system">("general");
</script>

<svelte:head>
	<title>Configuración</title>
</svelte:head>

<div class="config-container" in:fly={{ y: 8, duration: 350 }}>
	<!-- Encabezado de la Sección -->
	<header class="config-header">
		<div class="header-icon-wrap">
			<Settings size={28} />
		</div>
		<div class="header-texts">
			<h1 class="header-title">Configuración del Sistema</h1>
			<p class="header-subtitle">
				Parámetros globales, políticas de seguridad y monitoreo operacional de
				la plataforma.
			</p>
		</div>
	</header>

	<!-- Barra de Navegación por Pestañas -->
	<div class="tabs-bar">
		<button
			type="button"
			class="tab-btn"
			class:active={activeTab === "general"}
			onclick={() => (activeTab = "general")}
		>
			<Layers size={16} />
			<span>Parámetros Generales</span>
		</button>
		<button
			type="button"
			class="tab-btn"
			class:active={activeTab === "security"}
			onclick={() => (activeTab = "security")}
		>
			<Lock size={16} />
			<span>Políticas de Seguridad</span>
		</button>
		<button
			type="button"
			class="tab-btn"
			class:active={activeTab === "system"}
			onclick={() => (activeTab = "system")}
		>
			<Server size={16} />
			<span>Infraestructura y Worker</span>
		</button>
	</div>

	<!-- Contenido de la pestaña activa -->
	<main class="tab-content">
		{#if activeTab === "general"}
			<div class="cards-grid" in:fly={{ y: 6, duration: 250 }}>
				<div class="config-card">
					<div class="card-icon-wrap">
						<Layers size={20} />
					</div>
					<div class="card-body">
						<h3 class="card-title">Identidad del Sistema</h3>
						<p class="card-desc">
							Nombre y metadatos de la plataforma visibles para usuarios.
						</p>
						<div class="param-list">
							<div class="param-row">
								<span class="param-label">Aplicación:</span>
								<span class="param-value mono">Template SvelteKit</span>
							</div>
							<div class="param-row">
								<span class="param-label">Versión de Arquitectura:</span>
								<span class="param-value mono">SvelteKit 3 / Svelte 5</span>
							</div>
							<div class="param-row">
								<span class="param-label">Zona Horaria:</span>
								<span class="param-value">America/Lima (UTC-5)</span>
							</div>
						</div>
					</div>
				</div>

				<div class="config-card">
					<div class="card-icon-wrap">
						<Database size={20} />
					</div>
					<div class="card-body">
						<h3 class="card-title">Base de Datos Principal</h3>
						<p class="card-desc">
							Conexión a base de datos relacional y estado del motor ORM.
						</p>
						<div class="param-list">
							<div class="param-row">
								<span class="param-label">Motor:</span>
								<span class="param-value mono">PostgreSQL 17+</span>
							</div>
							<div class="param-row">
								<span class="param-label">Driver ORM:</span>
								<span class="param-value mono">@prisma/orm-postgres (v8)</span>
							</div>
							<div class="param-row">
								<span class="param-label">Migraciones:</span>
								<span class="param-badge active">Sincronizado</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === "security"}
			<div class="cards-grid" in:fly={{ y: 6, duration: 250 }}>
				<div class="config-card">
					<div class="card-icon-wrap">
						<ShieldCheck size={20} />
					</div>
					<div class="card-body">
						<h3 class="card-title">Cifrado y Autenticación</h3>
						<p class="card-desc">
							Estándares criptográficos aplicados a credenciales y sesiones.
						</p>
						<div class="param-list">
							<div class="param-row">
								<span class="param-label">Algoritmo de Hashing:</span>
								<span class="param-value mono">Argon2id</span>
							</div>
							<div class="param-row">
								<span class="param-label">Cookies de Sesión:</span>
								<span class="param-value mono">HttpOnly, SameSite=Lax</span>
							</div>
							<div class="param-row">
								<span class="param-label">TTL de Sesión:</span>
								<span class="param-value">24 horas continuas</span>
							</div>
						</div>
					</div>
				</div>

				<div class="config-card">
					<div class="card-icon-wrap">
						<Activity size={20} />
					</div>
					<div class="card-body">
						<h3 class="card-title">Watchdog de Sesión</h3>
						<p class="card-desc">
							Monitoreo activo para invalidación inmediata de cuentas
							desactivadas.
						</p>
						<div class="param-list">
							<div class="param-row">
								<span class="param-label">Frecuencia de Polling:</span>
								<span class="param-value">Cada 60 segundos</span>
							</div>
							<div class="param-row">
								<span class="param-label">Revisión en Foco:</span>
								<span class="param-badge active"
									>Activo (visibilitychange)</span
								>
							</div>
							<div class="param-row">
								<span class="param-label">Revocación Automática:</span>
								<span class="param-badge active">Activa</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === "system"}
			<div class="cards-grid" in:fly={{ y: 6, duration: 250 }}>
				<div class="config-card">
					<div class="card-icon-wrap">
						<Cpu size={20} />
					</div>
					<div class="card-body">
						<h3 class="card-title">Worker SSR y Tareas en Segundo Plano</h3>
						<p class="card-desc">
							Proceso independiente para limpieza de datos y cron jobs.
						</p>
						<div class="param-list">
							<div class="param-row">
								<span class="param-label">Proceso:</span>
								<span class="param-value mono">build/worker.js</span>
							</div>
							<div class="param-row">
								<span class="param-label">Limpieza de Sesiones:</span>
								<span class="param-value">Diario a las 03:00 AM</span>
							</div>
							<div class="param-row">
								<span class="param-label">Estado de Ejecución:</span>
								<span class="param-badge active">En Ejecución</span>
							</div>
						</div>
					</div>
				</div>

				<div class="config-card">
					<div class="card-icon-wrap">
						<Clock size={20} />
					</div>
					<div class="card-body">
						<h3 class="card-title">Control de Tablas Maestras</h3>
						<p class="card-desc">
							Punto de extensión para futuros catálogos del negocio.
						</p>
						<div class="param-list">
							<div class="param-row">
								<span class="param-label">Estructura Modular:</span>
								<span class="param-value">Pestañas dinámicas</span>
							</div>
							<div class="param-row">
								<span class="param-label">Nivel de Acceso:</span>
								<span class="param-value">ADMIN y SUPERADMIN</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
.config-container {
	display: flex;
	flex-direction: column;
	gap: 1.75rem;
	width: 100%;
	max-width: 1100px;
	padding: 1.5rem 1.25rem 3rem;
	margin: 0 auto;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));

	@media (width <= 768px) {
		gap: 1.25rem;
		padding: 1rem 0.75rem 2.5rem;
	}
}

.config-header {
	display: flex;
	gap: 1.25rem;
	align-items: center;
	padding: 1.5rem 1.75rem;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border: 1px solid light-dark(oklch(91% 0.01 250), oklch(27% 0.015 260));
	border-radius: 16px;
	box-shadow: 0 4px 20px -2px
		light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.2));
}

.header-icon-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;

	color: light-dark(oklch(40% 0.15 250), oklch(85% 0.12 250));

	background-color: light-dark(oklch(94% 0.03 250), oklch(26% 0.04 260));
	border-radius: 14px;
}

.header-texts {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.header-title {
	font-size: 1.35rem;
	font-weight: 800;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
	letter-spacing: -0.01em;
}

.header-subtitle {
	font-size: 0.88rem;
	color: light-dark(oklch(50% 0.02 255), oklch(72% 0.02 255));
}

/* ── Tabs Bar ──────────────────────────────────── */
.tabs-bar {
	display: flex;
	gap: 0.5rem;
	padding: 0.35rem;
	overflow-x: auto;

	background-color: light-dark(oklch(94.5% 0.008 250), oklch(23% 0.018 260));
	border: 1px solid light-dark(oklch(89% 0.01 250), oklch(28% 0.015 260));
	border-radius: 12px;
}

.tab-btn {
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
	padding: 0.6rem 1rem;

	font-size: 0.86rem;
	font-weight: 650;
	color: light-dark(oklch(50% 0.02 255), oklch(72% 0.02 255));
	white-space: nowrap;
	cursor: pointer;

	background: none;
	border: none;
	border-radius: 9px;

	transition: all 0.15s ease;

	&:hover:not(.active) {
		color: light-dark(oklch(20% 0.02 255), oklch(95% 0.01 255));
		background-color: light-dark(oklch(91% 0.01 250), oklch(27% 0.018 260));
	}

	&.active {
		color: light-dark(oklch(25% 0.08 250), oklch(98% 0.01 255));
		background-color: light-dark(oklch(100% 0 0), oklch(29% 0.025 260));
		box-shadow: 0 1px 4px light-dark(oklch(0% 0 0 / 0.06), oklch(0% 0 0 / 0.25));
	}
}

.tab-content {
	display: flex;
	flex-direction: column;
}

.cards-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
	gap: 1.5rem;

	@media (width <= 640px) {
		grid-template-columns: 1fr;
	}
}

.config-card {
	display: flex;
	gap: 1.25rem;
	padding: 1.5rem;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border: 1px solid light-dark(oklch(91% 0.01 250), oklch(27% 0.015 260));
	border-radius: 16px;
	box-shadow: 0 4px 20px -2px
		light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.2));
}

.card-icon-wrap {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;

	color: light-dark(oklch(40% 0.12 250), oklch(80% 0.1 250));

	background-color: light-dark(oklch(95% 0.02 250), oklch(27% 0.03 260));
	border-radius: 12px;
}

.card-body {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.5rem;
	min-width: 0;
}

.card-title {
	font-size: 1.05rem;
	font-weight: 700;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
}

.card-desc {
	font-size: 0.84rem;
	line-height: 1.4;
	color: light-dark(oklch(50% 0.02 255), oklch(72% 0.02 255));
}

.param-list {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	padding-top: 0.75rem;
	margin-top: 0.75rem;
	border-top: 1px solid light-dark(oklch(93% 0.01 250), oklch(27% 0.015 260));
}

.param-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 0.82rem;
}

.param-label {
	color: light-dark(oklch(48% 0.02 255), oklch(72% 0.02 255));
}

.param-value {
	font-weight: 600;
	color: light-dark(oklch(22% 0.02 255), oklch(92% 0.01 255));
}

.mono {
	font-family: var(--font-mono, monospace);
	font-size: 0.8rem;
}

.param-badge {
	display: inline-flex;
	padding: 0.15rem 0.55rem;
	font-size: 0.7rem;
	font-weight: 700;
	border-radius: 999px;

	&.active {
		color: light-dark(oklch(40% 0.12 150), oklch(85% 0.1 150));
		background-color: light-dark(oklch(94% 0.04 150), oklch(28% 0.06 150));
	}
}
</style>
