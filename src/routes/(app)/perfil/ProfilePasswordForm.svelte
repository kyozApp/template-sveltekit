<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import {
	CircleAlert,
	Eye,
	EyeOff,
	KeyRound,
	LoaderCircle,
	Lock,
	ShieldCheck,
} from "@lucide/svelte";
import { nanoid } from "nanoid";

import { changeProfilePassword } from "#lib/remote/profile/profile.form.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";
import { profilePasswordChangeSchema } from "#lib/validations/profile/profile.form.validation.ts";

const sessionId = nanoid();
const passwordForm = changeProfilePassword.for(sessionId);

const {
	currentPassword: fieldCurrent,
	newPassword: fieldNew,
	confirmPassword: fieldConfirm,
} = passwordForm.fields;

let formEl = $state<HTMLFormElement | null>(null);
let showCurrent = $state(false);
let showNew = $state(false);
let showConfirm = $state(false);

const submitting = $derived(passwordForm.pending > 0);
</script>

<div class="card-section">
	<div class="card-header">
		<h2 class="card-title">Seguridad y Contraseña</h2>
		<p class="card-subtitle">
			Actualiza tu contraseña periódicamente para mantener tu cuenta protegida.
			Al cambiarla, se cerrarán las sesiones activas en otros dispositivos.
		</p>
	</div>

	<form
		bind:this={formEl}
		class="form-root"
		{...passwordForm.preflight(profilePasswordChangeSchema.body)}
		{...passwordForm.enhance(async (f) => {
			try {
				const ok = await f.submit();

				if (ok) {
					const res = f.result;
					if (res && !res.success) {
						notifications.showToastError(res.error);
						return;
					}

					notifications.showToastSuccess(
						"¡Contraseña actualizada con éxito! Las demás sesiones han sido revocadas.",
					);
					formEl?.reset();
					return;
				}

				notifications.showToastError(
					"Ocurrió un error al procesar el cambio de contraseña. Por favor, verifica los campos.",
				);
			} catch (e) {
				if (isHttpError(e)) {
					notifications.showToastError(
						"No pudimos cambiar tu contraseña en este momento. Por favor, comunícate con sistemas.",
					);
				} else {
					notifications.showToastError(
						"No se pudo establecer comunicación con el servidor.",
					);
				}
			}
		})}
		oninput={() => passwordForm.validate()}
		novalidate
	>
		<div class="form-grid">
			<div class="form-group full-width">
				<label for="profile-current-password" class="form-label"
					>Contraseña Actual</label
				>
				<div class="input-wrapper">
					<span class="input-icon-left">
						<Lock size="16" />
					</span>
					<input
						{...fieldCurrent.as(showCurrent ? "text" : "password")}
						id="profile-current-password"
						class="form-input"
						placeholder=""
						autocomplete="current-password"
						disabled={submitting}
						class:has-error={fieldCurrent.issues()?.length}
					>
					<button
						type="button"
						class="input-icon-right"
						onclick={() => (showCurrent = !showCurrent)}
						aria-label={showCurrent
							? "Ocultar contraseña actual"
							: "Mostrar contraseña actual"}
						disabled={submitting}
					>
						{#if showCurrent}
							<EyeOff size="16" />
						{:else}
							<Eye size="16" />
						{/if}
					</button>
				</div>
				{#if fieldCurrent.issues()?.length}
					<span class="field-error">
						<CircleAlert size="14" />
						<span>{fieldCurrent.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="form-group">
				<label for="profile-new-password" class="form-label"
					>Nueva Contraseña</label
				>
				<div class="input-wrapper">
					<span class="input-icon-left">
						<KeyRound size="16" />
					</span>
					<input
						{...fieldNew.as(showNew ? "text" : "password")}
						id="profile-new-password"
						class="form-input"
						placeholder=""
						autocomplete="new-password"
						disabled={submitting}
						class:has-error={fieldNew.issues()?.length}
					>
					<button
						type="button"
						class="input-icon-right"
						onclick={() => (showNew = !showNew)}
						aria-label={showNew
							? "Ocultar nueva contraseña"
							: "Mostrar nueva contraseña"}
						disabled={submitting}
					>
						{#if showNew}
							<EyeOff size="16" />
						{:else}
							<Eye size="16" />
						{/if}
					</button>
				</div>
				{#if fieldNew.issues()?.length}
					<span class="field-error">
						<CircleAlert size="14" />
						<span>{fieldNew.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="form-group">
				<label for="profile-confirm-password" class="form-label"
					>Confirmar Nueva Contraseña</label
				>
				<div class="input-wrapper">
					<span class="input-icon-left">
						<ShieldCheck size="16" />
					</span>
					<input
						{...fieldConfirm.as(showConfirm ? "text" : "password")}
						id="profile-confirm-password"
						class="form-input"
						placeholder=""
						autocomplete="new-password"
						disabled={submitting}
						class:has-error={fieldConfirm.issues()?.length}
					>
					<button
						type="button"
						class="input-icon-right"
						onclick={() => (showConfirm = !showConfirm)}
						aria-label={showConfirm
							? "Ocultar confirmación de contraseña"
							: "Mostrar confirmación de contraseña"}
						disabled={submitting}
					>
						{#if showConfirm}
							<EyeOff size="16" />
						{:else}
							<Eye size="16" />
						{/if}
					</button>
				</div>
				{#if fieldConfirm.issues()?.length}
					<span class="field-error">
						<CircleAlert size="14" />
						<span>{fieldConfirm.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>
		</div>

		<div class="form-actions">
			<button
				type="submit"
				class="btn-save"
				disabled={submitting}
				aria-label="Actualizar contraseña"
			>
				{#if submitting}
					<LoaderCircle size={16} class="spinner" />
					<span>Actualizando...</span>
				{:else}
					<Lock size={16} />
					<span>Actualizar Contraseña</span>
				{/if}
			</button>
		</div>
	</form>
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

.form-root {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.form-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.25rem;

	@media (width <= 640px) {
		grid-template-columns: 1fr;
	}
}

.full-width {
	grid-column: 1 / -1;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
}

.form-label {
	font-size: 0.84rem;
	font-weight: 600;
	color: light-dark(oklch(30% 0.02 255), oklch(88% 0.01 255));
}

.input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.input-icon-left {
	position: absolute;
	left: 0.95rem;
	display: flex;
	align-items: center;
	color: light-dark(oklch(60% 0.02 255), oklch(65% 0.02 255));
	pointer-events: none;
}

.input-icon-right {
	position: absolute;
	right: 0.95rem;
	display: flex;
	align-items: center;
	padding: 0;
	color: light-dark(oklch(60% 0.02 255), oklch(65% 0.02 255));
	cursor: pointer;
	background: none;
	border: none;
	transition: color 0.15s ease;

	&:hover:not(:disabled) {
		color: light-dark(oklch(30% 0.02 255), oklch(90% 0.01 255));
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
}

.form-input {
	width: 100%;
	height: 42px;
	padding: 0 2.5rem 0 2.5rem;

	font-size: 0.9rem;
	color: light-dark(oklch(20% 0.02 255), oklch(95% 0.01 255));

	background-color: light-dark(oklch(98% 0.005 250), oklch(25% 0.02 260));
	border: 1px solid light-dark(oklch(88% 0.01 250), oklch(32% 0.02 260));
	border-radius: 10px;

	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease;

	&:focus {
		outline: none;
		border-color: light-dark(oklch(45% 0.14 250), oklch(70% 0.14 250));
		box-shadow: 0 0 0 3px
			light-dark(oklch(45% 0.14 250 / 0.15), oklch(70% 0.14 250 / 0.2));
	}

	&.has-error {
		border-color: light-dark(oklch(55% 0.2 25), oklch(65% 0.2 25));
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
}

.field-error {
	display: flex;
	gap: 0.35rem;
	align-items: center;
	font-size: 0.78rem;
	font-weight: 500;
	color: light-dark(oklch(52% 0.18 25), oklch(70% 0.16 25));
}

.form-actions {
	display: flex;
	justify-content: flex-end;
}

.btn-save {
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
	justify-content: center;
	height: 40px;
	padding: 0 1.25rem;

	font-size: 0.88rem;
	font-weight: 650;
	color: white;
	cursor: pointer;

	background-color: light-dark(oklch(45% 0.14 250), oklch(50% 0.14 250));
	border: none;
	border-radius: 10px;

	transition:
		background-color 0.15s ease,
		opacity 0.15s ease;

	&:hover:not(:disabled) {
		background-color: light-dark(oklch(38% 0.16 250), oklch(56% 0.16 250));
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
}

.btn-save :global(.spinner) {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
