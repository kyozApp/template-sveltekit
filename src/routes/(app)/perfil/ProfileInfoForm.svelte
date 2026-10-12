<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { refreshAll } from "$app/navigation";

import { CircleAlert, LoaderCircle, Mail, Save, User } from "@lucide/svelte";
import { nanoid } from "nanoid";

import { updateProfile } from "#lib/remote/profile/profile.form.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";
import { profileUpdateSchema } from "#lib/validations/profile/profile.form.validation.ts";

interface Props {
	initialData: {
		name: string;
		username: string;
		email: string;
	};
}

let { initialData }: Props = $props();

const sessionId = nanoid();
const profileForm = updateProfile.for(sessionId);

const {
	name: fieldName,
	username: fieldUsername,
	email: fieldEmail,
} = profileForm.fields;

const submitting = $derived(profileForm.pending > 0);
</script>

<div class="card-section">
	<div class="card-header">
		<h2 class="card-title">Información Personal</h2>
		<p class="card-subtitle">
			Actualiza tu nombre completo, usuario y correo electrónico de contacto.
		</p>
	</div>

	<form
		class="form-root"
		{...profileForm.preflight(profileUpdateSchema.body)}
		{...profileForm.enhance(async (f) => {
			try {
				const ok = await f.submit();

				if (ok) {
					const res = f.result;
					if (res && !res.success) {
						notifications.showToastError(res.error);
						return;
					}

					notifications.showToastSuccess(
						"¡Tus datos de perfil han sido actualizados con éxito!",
					);
					await refreshAll();
					return;
				}

				notifications.showToastError(
					"Ocurrió un error al procesar la actualización. Por favor, revisa los datos.",
				);
			} catch (e) {
				if (isHttpError(e)) {
					notifications.showToastError(
						"No pudimos actualizar tu perfil en este momento. Por favor, comunícate con sistemas.",
					);
				} else {
					notifications.showToastError(
						"No se pudo establecer comunicación con el servidor.",
					);
				}
			}
		})}
		oninput={() => profileForm.validate()}
		novalidate
	>
		<div class="form-grid">
			<div class="form-group full-width">
				<label for="profile-name" class="form-label">Nombre Completo</label>
				<div class="input-wrapper">
					<span class="input-icon-left">
						<User size="16" />
					</span>
					<input
						{...fieldName.as("text", initialData.name)}
						id="profile-name"
						class="form-input"
						placeholder=""
						autocomplete="name"
						disabled={submitting}
						class:has-error={fieldName.issues()?.length}
					>
				</div>
				{#if fieldName.issues()?.length}
					<span class="field-error">
						<CircleAlert size="14" />
						<span>{fieldName.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="form-group">
				<label for="profile-username" class="form-label"
					>Nombre de Usuario</label
				>
				<div class="input-wrapper">
					<span class="input-icon-left">
						<User size="16" />
					</span>
					<input
						{...fieldUsername.as("text", initialData.username)}
						id="profile-username"
						class="form-input"
						placeholder=""
						autocomplete="username"
						disabled={submitting}
						class:has-error={fieldUsername.issues()?.length}
					>
				</div>
				{#if fieldUsername.issues()?.length}
					<span class="field-error">
						<CircleAlert size="14" />
						<span>{fieldUsername.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="form-group">
				<label for="profile-email" class="form-label">Correo Electrónico</label>
				<div class="input-wrapper">
					<span class="input-icon-left">
						<Mail size="16" />
					</span>
					<input
						{...fieldEmail.as("text", initialData.email)}
						id="profile-email"
						class="form-input"
						placeholder=""
						autocomplete="email"
						disabled={submitting}
						class:has-error={fieldEmail.issues()?.length}
					>
				</div>
				{#if fieldEmail.issues()?.length}
					<span class="field-error">
						<CircleAlert size="14" />
						<span>{fieldEmail.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>
		</div>

		<div class="form-actions">
			<button
				type="submit"
				class="btn-save"
				disabled={submitting}
				aria-label="Guardar cambios de perfil"
			>
				{#if submitting}
					<LoaderCircle size={16} class="spinner" />
					<span>Guardando...</span>
				{:else}
					<Save size={16} />
					<span>Guardar Cambios</span>
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

.form-input {
	width: 100%;
	height: 42px;
	padding: 0 1rem 0 2.5rem;

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
