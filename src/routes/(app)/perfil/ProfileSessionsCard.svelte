<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { Laptop, LoaderCircle, ShieldAlert, Trash2 } from "@lucide/svelte";

import { revokeProfileSession } from "#lib/remote/profile/profile.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface SessionItem {
	id: string;
	createdAt: string;
	expiresAt: string;
	isCurrent: boolean;
}

interface Props {
	sessions: SessionItem[];
}

let { sessions }: Props = $props();

let revokingId = $state<string | null>(null);

const handleRevoke = async (sessionId: string) => {
	if (revokingId) return;
	revokingId = sessionId;

	try {
		await revokeProfileSession({ sessionId });
		notifications.showToastSuccess("Sesión cerrada con éxito.");
	} catch (e) {
		if (isHttpError(e)) {
			notifications.showToastError(
				"No pudimos revocar la sesión en este momento.",
			);
		} else {
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor.",
			);
		}
	} finally {
		revokingId = null;
	}
};
</script>

<div class="card-section">
	<div class="card-header">
		<h2 class="card-title">Dispositivos y Sesiones Activas</h2>
		<p class="card-subtitle">
			Supervisa los dispositivos donde mantienes iniciada tu sesión. Puedes
			cerrar el acceso en cualquier sesión remota.
		</p>
	</div>

	<div class="sessions-list">
		{#if sessions.length === 0}
			<div class="empty-state">
				<ShieldAlert size={28} />
				<p>No se encontraron registros de sesiones activas.</p>
			</div>
		{:else}
			{#each sessions as session (session.id)}
				<div class="session-item" class:current={session.isCurrent}>
					<div class="session-icon-wrap">
						<Laptop size={18} />
					</div>

					<div class="session-details">
						<div class="session-meta-row">
							<span class="session-name">
								{session.isCurrent
									? "Dispositivo Actual"
									: "Dispositivo Remoto"}
							</span>
							{#if session.isCurrent}
								<span class="badge-current">En línea ahora</span>
							{/if}
						</div>
						<div class="session-dates">
							<span>
								Iniciada el
								{new Date(session.createdAt).toLocaleDateString("es-PE", {
									day: "2-digit",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
							<span class="separator">•</span>
							<span>
								Expira el
								{new Date(session.expiresAt).toLocaleDateString("es-PE", {
									day: "2-digit",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>

					{#if !session.isCurrent}
						<button
							type="button"
							class="btn-revoke"
							onclick={() => handleRevoke(session.id)}
							disabled={revokingId === session.id}
							aria-label="Cerrar esta sesión remota"
							data-tooltip="Cerrar sesión"
							data-tooltip-position="top-end"
						>
							{#if revokingId === session.id}
								<LoaderCircle size={15} class="spinner" />
							{:else}
								<Trash2 size={15} />
							{/if}
						</button>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
.card-section {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1.75rem;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border: 1px solid light-dark(oklch(91% 0.01 250), oklch(27% 0.015 260));
	border-radius: 16px;
	box-shadow: 0 4px 20px -2px
		light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.2));
}

.card-header {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.card-title {
	font-size: 1.15rem;
	font-weight: 700;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
}

.card-subtitle {
	font-size: 0.88rem;
	color: light-dark(oklch(50% 0.02 255), oklch(72% 0.02 255));
}

.sessions-list {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.session-item {
	display: flex;
	gap: 1rem;
	align-items: center;
	padding: 1rem 1.25rem;

	background-color: light-dark(oklch(98.5% 0.005 250), oklch(24% 0.02 260));
	border: 1px solid light-dark(oklch(90% 0.01 250), oklch(29% 0.015 260));
	border-radius: 12px;

	transition: border-color 0.15s ease;

	&.current {
		background-color: light-dark(oklch(98.5% 0.015 150), oklch(24% 0.03 150));
		border-color: light-dark(oklch(80% 0.08 150), oklch(35% 0.08 150));
	}
}

.session-icon-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 38px;
	height: 38px;

	color: light-dark(oklch(40% 0.05 250), oklch(80% 0.05 250));

	background-color: light-dark(oklch(95% 0.01 250), oklch(28% 0.02 260));
	border-radius: 10px;
}

.session-details {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.25rem;
	min-width: 0;
}

.session-meta-row {
	display: flex;
	gap: 0.65rem;
	align-items: center;
}

.session-name {
	font-size: 0.92rem;
	font-weight: 650;
	color: light-dark(oklch(25% 0.02 255), oklch(95% 0.01 255));
}

.badge-current {
	display: inline-flex;
	align-items: center;
	padding: 0.18rem 0.55rem;

	font-size: 0.68rem;
	font-weight: 700;
	color: light-dark(oklch(40% 0.12 150), oklch(85% 0.1 150));
	text-transform: uppercase;
	letter-spacing: 0.03em;

	background-color: light-dark(oklch(94% 0.04 150), oklch(28% 0.06 150));
	border-radius: 999px;
}

.session-dates {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
	align-items: center;

	font-size: 0.78rem;
	color: light-dark(oklch(55% 0.02 255), oklch(70% 0.02 255));
}

.separator {
	color: light-dark(oklch(75% 0.01 250), oklch(45% 0.01 250));
}

.btn-revoke {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;

	color: light-dark(oklch(45% 0.14 25), oklch(75% 0.12 25));
	cursor: pointer;

	background-color: light-dark(oklch(96% 0.015 25), oklch(27% 0.03 25));
	border: 1px solid light-dark(oklch(88% 0.02 25), oklch(34% 0.03 25));
	border-radius: 10px;

	transition: all 0.15s ease;

	&:hover:not(:disabled) {
		color: light-dark(oklch(35% 0.18 25), oklch(90% 0.14 25));
		background-color: light-dark(oklch(93% 0.03 25), oklch(32% 0.05 25));
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}
}

.btn-revoke :global(.spinner) {
	animation: spin 1s linear infinite;
}

.empty-state {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: center;
	padding: 2.5rem 1rem;

	font-size: 0.9rem;
	color: light-dark(oklch(55% 0.02 255), oklch(70% 0.02 255));
	text-align: center;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
