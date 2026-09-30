<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { page } from "$app/state";

const ROLE_LABELS: Record<string, string> = {
	SUPERADMIN: "Superadministrador",
	ADMIN: "Administrador",
	USER: "Usuario",
	VIEWER: "Visitante",
};

import {
	CircleAlert,
	Eye,
	EyeOff,
	LoaderCircle,
	Lock,
	Mail,
	Pencil,
	Shield,
	TriangleAlert,
	User,
} from "@lucide/svelte";
import { nanoid } from "nanoid";

import { updateUser } from "#lib/remote/user/user.form.remote";
import { getUserDetails } from "#lib/remote/user/user.query.remote";
import { notifications } from "#lib/services/notifications.svelte";
import { userUpdateSchema } from "#lib/validations/user/user.form.validation";

interface Props {
	userId: string;
	onClose: () => void;
}

let { userId, onClose }: Props = $props();

const sessionId = nanoid();

const updateForm = updateUser.for(sessionId);

const {
	id: fieldId,
	name: fieldName,
	username: fieldUsername,
	email: fieldEmail,
	password: fieldPassword,
	role: fieldRole,
	isActive: fieldIsActive,
} = updateForm.fields;

let showPassword = $state(false);

const submitting = $derived(updateForm.pending > 0);
</script>

<div class="form-wrapper">
	<svelte:boundary>
		{@const details = await getUserDetails({ id: userId })}

		{@const currentIsActive =
	fieldIsActive.value() ?? (details.isActive ? "true" : "false")}
		{@const isActiveChecked = currentIsActive === "true"}

		<form
			class="user-form"
			{...updateForm.preflight(userUpdateSchema.body)}
			{...updateForm.enhance(async (f) => {
	try {
		const ok = await f.submit();

		if (ok) {
			const res = f.result;
			if (res && !res.success) {
				notifications.showToastError(res.error);
				return;
			}

			notifications.showToastSuccess("¡Usuario actualizado correctamente!");
			onClose();
			return;
		}

		console.error("[USER UPDATE][PROCESSING ERROR]", { ok });
		notifications.showToastError(
			"Ocurrió un problema inesperado al procesar la actualización del usuario. Por favor, comuníquese con sistemas.",
		);
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[USER UPDATE][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos actualizar el usuario en este momento. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[USER UPDATE][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	}
})}
			oninput={() => updateForm.validate()}
			novalidate
		>
			<div class="form-fields">
				<div class="form-grid">
					<div class="form-group">
						<label for="user-update-name" class="form-label"
							>Nombre Completo</label
						>
						<div class="input-wrapper">
							<span class="input-icon-left">
								<User size="16" />
							</span>
							<input
								{...fieldName.as("text", details.name)}
								id="user-update-name"
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
						<label for="user-update-username" class="form-label"
							>Nombre de Usuario</label
						>
						<div class="input-wrapper">
							<span class="input-icon-left">
								<User size="16" />
							</span>
							<input
								{...fieldUsername.as("text", details.username)}
								id="user-update-username"
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
						<label for="user-update-email" class="form-label"
							>Correo Electrónico</label
						>
						<div class="input-wrapper">
							<span class="input-icon-left">
								<Mail size="16" />
							</span>
							<input
								{...fieldEmail.as("text", details.email)}
								id="user-update-email"
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

					<div class="form-group">
						<label for="user-update-password" class="form-label"
							>Contraseña</label
						>
						<div class="input-wrapper">
							<span class="input-icon-left">
								<Lock size="16" />
							</span>
							<input
								{...fieldPassword.as(showPassword ? "text" : "password", "")}
								id="user-update-password"
								class="form-input"
								placeholder="Solo si cambia"
								autocomplete="new-password"
								disabled={submitting}
								class:has-error={fieldPassword.issues()?.length}
							>
							<button
								type="button"
								class="input-icon-right"
								onclick={() => (showPassword = !showPassword)}
								aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
								disabled={submitting}
							>
								{#if showPassword}
									<EyeOff size="16" />
								{:else}
									<Eye size="16" />
								{/if}
							</button>
						</div>
						{#if fieldPassword.issues()?.length}
							<span class="field-error">
								<CircleAlert size="14" />
								<span>{fieldPassword.issues()?.[0]?.message}</span>
							</span>
						{/if}
					</div>
				</div>

				<div class="form-group">
					<label for="user-update-role" class="form-label"
						>Rol del Usuario</label
					>

					{#if details.role === "SUPERADMIN" || page.data.user?.id === details.id}
						<input {...fieldRole.as("hidden", details.role)}>
						<div class="static-role-display">
							<span class="input-icon-left">
								<Shield size="16" />
							</span>
							<span class="role-text"
								>{ROLE_LABELS[details.role as keyof typeof ROLE_LABELS] || details.role}</span
							>
							<span class="role-badge">Rol protegido</span>
						</div>
					{:else}
						<div class="input-wrapper select-wrapper">
							<span class="input-icon-left">
								<Shield size="16" />
							</span>
							<select
								{...fieldRole.as("select", details.role)}
								id="user-update-role"
								class="form-input form-select"
								disabled={submitting}
								class:has-error={fieldRole.issues()?.length}
							>
								<option value="ADMIN">Administrador</option>
								<option value="USER">Usuario</option>
								<option value="VIEWER">Visitante</option>
							</select>
						</div>
					{/if}

					{#if fieldRole.issues()?.length}
						<span class="field-error">
							<CircleAlert size="14" />
							<span>{fieldRole.issues()?.[0]?.message}</span>
						</span>
					{/if}
				</div>

				{#if details.role !== "SUPERADMIN"}
					<div class="status-section">
						<div class="status-icon-wrap">
							<span class="status-icon">
								<User size="16" />
							</span>
						</div>
						<div class="status-info">
							<span class="status-label">Estado de la cuenta</span>

							<span class="status-pill" class:pill-active={isActiveChecked}>
								{isActiveChecked ? "Cuenta activa" : "Cuenta inactiva"}
							</span>
						</div>
						<input {...fieldId.as("hidden", details.id)}>
						<input {...fieldIsActive.as("hidden", currentIsActive)}>
						<button
							type="button"
							role="switch"
							aria-checked={isActiveChecked}
							class="switch-control"
							class:active={isActiveChecked}
							onclick={() => fieldIsActive.set(isActiveChecked ? "false" : "true")}
							disabled={submitting}
						>
							<span class="switch-track"></span>
							<span class="switch-thumb"></span>
							<span class="sr-only">Estado de la cuenta</span>
						</button>
					</div>
				{:else}
					<input {...fieldId.as("hidden", details.id)}>
					<input {...fieldIsActive.as("hidden", "true")}>
				{/if}
			</div>

			<div class="form-actions">
				<button
					type="button"
					class="cancel-btn"
					onclick={onClose}
					disabled={submitting}
				>
					<span class="btn-inner">
						<span>Cancelar</span>
					</span>
				</button>

				<button type="submit" disabled={submitting} class="submit-btn">
					<span class="btn-inner">
						{#if submitting}
							<LoaderCircle size="18" class="spinner" />
							<span>Guardando cambios...</span>
						{:else}
							<Pencil size="18" />
							<span>Actualizar Usuario</span>
						{/if}
					</span>
				</button>
			</div>
		</form>

		{#snippet pending()}
			<div class="details-loading-state">
				<div class="loading-icon-wrap">
					<LoaderCircle size="24" class="spinner" />
				</div>
				<p class="loading-title">Cargando información</p>
				<p class="loading-sub">Estamos recuperando los datos del usuario.</p>
			</div>
		{/snippet}

		{#snippet failed()}
			<div class="details-error-state">
				<div class="error-icon-wrap">
					<TriangleAlert size="24" />
				</div>
				<p class="error-title">No se pudo cargar la información</p>
				<p class="error-sub">
					Ocurrió un problema al obtener los detalles del usuario.
				</p>
			</div>
		{/snippet}
	</svelte:boundary>
</div>

<style>
.form-wrapper {
	flex: 1;

	min-block-size: 0;
	padding-block: 1.4rem 1.75rem;
	padding-inline: 2rem;
	overflow: auto;
	overscroll-behavior: contain;

	background-color: light-dark(oklch(98.8% 0.003 248), oklch(17% 0.015 260));

	@media (width < 640px) {
		padding-block: 1.2rem 1.4rem;
		padding-inline: 1.25rem;
	}
}

.user-form {
	display: flex;
	flex-direction: column;
	gap: 1.4rem;
}

.sr-only {
	position: absolute;

	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;

	overflow: hidden;
	border: 0;

	clip-path: rect(0 0 0 0);
}

.form-fields {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.form-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.95rem;

	@media (width >= 720px) {
		grid-template-columns: 1fr 1fr;
	}
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-label {
	font-size: 0.74rem;
	font-weight: 700;
	color: light-dark(oklch(35% 0.012 255), oklch(75% 0.02 255));
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.input-wrapper {
	position: relative;

	display: flex;
	align-items: center;

	width: 100%;
}

.select-wrapper {
	&::after {
		position: absolute;
		right: 1rem;
		z-index: var(--z-raised);

		width: 8px;
		height: 8px;
		margin-top: -5px;
		pointer-events: none;
		content: "";
		border-right: 1.5px solid
			light-dark(oklch(38% 0.01 255), oklch(75% 0.02 255));
		border-bottom: 1.5px solid
			light-dark(oklch(38% 0.01 255), oklch(75% 0.02 255));
		transform: rotate(45deg);

		transition: border-color 0.2s ease;
	}

	&:focus-within::after {
		border-right-color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
		border-bottom-color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
	}
}

.form-input {
	width: 100%;
	min-block-size: 50px;
	padding: 0.92rem 2.85rem;
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 13px;

	font-size: 0.94rem;
	font-weight: 500;
	color: light-dark(oklch(23% 0.012 255), oklch(95% 0.004 255));

	appearance: none;
	background-color: light-dark(oklch(100% 0 0), oklch(27.5% 0.032 256.86));

	transition:
		border-color 0.2s ease,
		background-color 0.22s ease;

	-webkit-tap-highlight-color: transparent;

	&::placeholder {
		font-size: 0.84rem;
		font-weight: 430;
		color: light-dark(oklch(61% 0.008 255), oklch(67% 0.012 255));
	}

	&.form-select {
		padding-right: 3rem;
		cursor: pointer;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.62;
	}

	&:focus {
		outline: none;

		background-color: light-dark(
			oklch(99.2% 0.002 248),
			oklch(30% 0.038 256.86)
		);
		border-color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
		box-shadow: 0 0 0 3px
			light-dark(oklch(42% 0.14 250 / 0.12), oklch(74% 0.12 250 / 0.18));
	}

	&.has-error {
		border-color: light-dark(oklch(72% 0.12 25), oklch(58% 0.1 25));
	}
}

.input-icon-left {
	position: absolute;
	left: 1rem;
	z-index: var(--z-raised);

	display: flex;
	align-items: center;
	justify-content: center;

	width: 1.1rem;
	height: 1.1rem;

	color: light-dark(oklch(42% 0.01 255), oklch(75% 0.02 255));
	pointer-events: none;

	transition: color 0.22s ease;
}

.input-icon-right {
	position: absolute;
	right: 0.8rem;
	z-index: var(--z-field-control);

	display: flex;
	align-items: center;
	justify-content: center;

	width: 34px;
	height: 34px;
	padding: 0;

	color: light-dark(oklch(42% 0.01 255), oklch(75% 0.02 255));
	cursor: pointer;

	background-color: light-dark(
		oklch(97.5% 0.004 248),
		oklch(31.5% 0.04 256.86)
	);
	border: 1px solid transparent;
	border-radius: 10px;

	transition:
		border-color 0.18s ease,
		color 0.18s ease,
		background-color 0.18s ease;

	&:hover {
		color: light-dark(oklch(23% 0.012 255), oklch(82% 0.024 255));

		background-color: light-dark(
			oklch(98.2% 0.003 248),
			oklch(30% 0.038 256.86)
		);
		border-color: light-dark(oklch(84% 0.008 248), oklch(38% 0.026 256.86));
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}

.field-error {
	display: inline-flex;
	gap: 0.3rem;
	align-items: center;
	padding: 0;

	margin-top: 0.04rem;

	font-size: 0.72rem;
	font-weight: 500;
	line-height: 1.3;
	color: light-dark(oklch(52% 0.12 25), oklch(66% 0.08 25));
	border-radius: 0;
}

.static-role-display {
	position: relative;

	display: flex;
	gap: 0.7rem;
	align-items: center;

	width: 100%;
	min-block-size: 50px;
	padding: 0.92rem 1rem 0.92rem 2.85rem;

	background-color: light-dark(oklch(100% 0 0), oklch(27.5% 0.032 256.86));
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 13px;

	@media (width < 560px) {
		flex-wrap: wrap;
		padding-inline-end: 0.9rem;
	}
}

.role-text {
	flex: 1;

	font-size: 0.94rem;
	font-weight: 500;
	color: light-dark(oklch(23% 0.012 255), oklch(95% 0.004 255));
}

.role-badge {
	display: inline-flex;
	align-items: center;

	padding: 0.28rem 0.72rem;

	font-size: 0.68rem;
	font-weight: 700;
	color: light-dark(oklch(36% 0.01 255), oklch(75% 0.02 255));
	text-transform: uppercase;
	letter-spacing: 0.04em;

	background-color: light-dark(
		oklch(97.6% 0.004 248),
		oklch(31.5% 0.04 256.86)
	);
	border-radius: 999px;
}

.status-section {
	display: flex;
	gap: 0.9rem;
	align-items: center;
	justify-content: space-between;

	padding: 1rem 1rem 1rem 0.95rem;

	background-color: light-dark(
		oklch(99.1% 0.002 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 16px;

	@media (width < 560px) {
		align-items: flex-start;
	}
}

.status-icon-wrap {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;

	width: 40px;
	height: 40px;

	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(27.5% 0.032 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 12px;
}

.status-icon {
	display: flex;
	align-items: center;
	justify-content: center;

	color: light-dark(oklch(40% 0.0096 252.81), oklch(75% 0.02 255));
}

.status-info {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.22rem;
}

.status-label {
	font-size: 0.92rem;
	font-weight: 680;
	color: light-dark(oklch(23% 0.012 255), oklch(95% 0.004 255));
}

.status-pill {
	display: inline-flex;
	align-items: center;
	align-self: flex-start;
	padding: 0.28rem 0.72rem;

	margin-top: 0.3rem;

	font-size: 0.68rem;
	font-weight: 700;
	color: light-dark(oklch(36% 0.01 255), oklch(75% 0.02 255));
	text-transform: uppercase;
	letter-spacing: 0.04em;

	background-color: light-dark(
		oklch(97.6% 0.004 248),
		oklch(31.5% 0.04 256.86)
	);

	transition:
		color 0.25s ease,
		background-color 0.25s ease;

	&.pill-active {
		color: light-dark(oklch(49% 0.095 155), oklch(69% 0.08 155));
		background-color: light-dark(oklch(96.8% 0.018 155), oklch(28% 0.028 155));
	}
}

.switch-control {
	cursor: pointer;

	position: relative;

	flex-shrink: 0;

	width: 54px;
	height: 30px;
	padding: 0;
	border: none;
	border-radius: 9999px;

	background: transparent;

	-webkit-tap-highlight-color: transparent;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}
}

.switch-track {
	position: absolute;
	inset: 0;

	background-color: light-dark(oklch(88% 0.008 245), oklch(27% 0.015 260));

	border-radius: 9999px;
	box-shadow: 0 0 0 1px light-dark(oklch(83% 0.01 245), oklch(38% 0.024 256.86))
		inset;

	transition:
		background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-thumb {
	position: absolute;
	top: 3px;
	left: 3px;

	width: 24px;
	height: 24px;

	background-color: light-dark(oklch(99% 0.002 245), oklch(78% 0.008 255));
	border-radius: 50%;
	box-shadow: 0 0 0 1px light-dark(oklch(82% 0.01 245), oklch(60% 0.012 255))
		inset;

	transition:
		background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
		width 0.12s ease;
}

.switch-control.active .switch-track {
	background-color: light-dark(oklch(60% 0.075 150), oklch(63% 0.072 155));
	box-shadow: 0 0 0 1px light-dark(oklch(60% 0.075 150), oklch(63% 0.072 155))
		inset;
}

.switch-control.active .switch-thumb {
	background-color: light-dark(oklch(99% 0.002 245), oklch(23.5% 0.018 255));
	box-shadow: none;
	transform: translateX(24px);
}

.switch-control:active:not(:disabled) .switch-thumb {
	width: 28px;
}

.switch-control.active:active:not(:disabled) .switch-thumb {
	transform: translateX(20px);
}

.form-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.8rem;
	align-items: center;
	justify-content: flex-end;

	@media (width < 560px) {
		justify-content: stretch;
	}
}

.cancel-btn,
.submit-btn {
	cursor: pointer;

	display: flex;
	align-items: center;
	justify-content: center;

	min-inline-size: 170px;
	padding: 0;
	border-radius: 13px;

	font-size: 0.94rem;
	font-weight: 700;
	letter-spacing: 0.005em;

	transition:
		background-color 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;

	-webkit-tap-highlight-color: transparent;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.72;
	}

	@media (width < 560px) {
		flex: 1 1 100%;
		min-inline-size: 0;
	}
}

.cancel-btn {
	color: light-dark(oklch(26% 0.012 255), oklch(92% 0.004 255));

	background-color: light-dark(oklch(100% 0 0), oklch(22% 0.018 255));
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));

	&:hover:not(:disabled) {
		background-color: light-dark(oklch(96% 0.004 248), oklch(26% 0.02 255));
		border-color: light-dark(oklch(82% 0.008 248), oklch(34% 0.02 255));
	}
}

.submit-btn {
	color: light-dark(oklch(40% 0.0096 252.81), oklch(75% 0.02 255));

	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(31.5% 0.04 256.86)
	);
	border: 1px solid light-dark(oklch(84% 0.018 236), oklch(27% 0.015 260));

	&:hover:not(:disabled) {
		color: light-dark(oklch(38% 0.12 250), oklch(80% 0.12 250));
		background-color: light-dark(oklch(95% 0.025 250), oklch(26% 0.035 250));
		border-color: light-dark(oklch(85% 0.045 250), oklch(36% 0.045 250));
	}
}

.submit-btn :global(.spinner) {
	animation: spin-1s-submit-btn 1s linear infinite;
}

.btn-inner {
	position: relative;
	z-index: var(--z-raised);

	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
	justify-content: center;

	inline-size: 100%;
	padding: 0.9rem 1.15rem;
}

@keyframes spin-1s-submit-btn {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.details-loading-state,
.details-error-state {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	align-items: center;
	justify-content: center;

	min-block-size: 320px;
	padding: 2rem;
}

.loading-icon-wrap,
.error-icon-wrap {
	display: flex;
	align-items: center;
	justify-content: center;

	width: 56px;
	height: 56px;

	background-color: light-dark(oklch(100% 0 0), oklch(27.5% 0.032 256.86));
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 16px;
}

.loading-icon-wrap {
	color: light-dark(oklch(42% 0.14 250), oklch(74% 0.12 250));
}

.error-icon-wrap {
	color: light-dark(oklch(52% 0.12 25), oklch(66% 0.08 25));
}

.loading-icon-wrap :global(.spinner) {
	animation: spin-1s-loading-icon-wrap 1s linear infinite;
}

@keyframes spin-1s-loading-icon-wrap {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.loading-title,
.error-title {
	margin: 0;

	font-size: 1rem;
	font-weight: 680;
	color: light-dark(oklch(23% 0.012 255), oklch(95% 0.004 255));
	text-align: center;
}

.loading-sub,
.error-sub {
	max-width: 32ch;
	margin: 0;

	font-size: 0.84rem;
	font-weight: 500;
	line-height: 1.45;
	color: light-dark(oklch(49% 0.008 255), oklch(70% 0.008 255));
	text-align: center;
}
</style>
