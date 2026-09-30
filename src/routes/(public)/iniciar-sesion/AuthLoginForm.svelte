<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

import {
	CircleAlert,
	Eye,
	EyeOff,
	LoaderCircle,
	Lock,
	LogIn,
	User,
} from "@lucide/svelte";

import { loginUser } from "#lib/remote/auth/auth.form.remote";
import { notifications } from "#lib/services/notifications.svelte";
import { authLoginSchema } from "#lib/validations/auth/auth.form.validation";

const { username, password } = loginUser.fields;

let showPassword = $state(false);

const submitting = $derived(loginUser.pending > 0);
</script>

<form
	class="login-form"
	{...loginUser.preflight(authLoginSchema.body)}
	{...loginUser.enhance(async (f) => {
	try {
		const ok = await f.submit();

		if (ok) {
			const res = f.result;
			if (res && !res.success) {
				notifications.showToastError(res.error);
				return;
			}
			notifications.showToastSuccess("¡Sesión iniciada con éxito!");
			await goto(resolve("/dashboard"));
			return;
		}

		console.error("[AUTH LOGIN][PROCESSING ERROR]", { ok });
		notifications.showErrorAlert(
			"Error de Procesamiento",
			"Ocurrió un problema inesperado al procesar el inicio de sesión. Por favor, comuníquese con sistemas.",
		);
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[AUTH LOGIN][HTTP ERROR]", e);
			notifications.showErrorAlert(
				"Servicio No Disponible",
				"No pudimos iniciar sesión en este momento. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[AUTH LOGIN][CONNECTION ERROR]", e);
			notifications.showErrorAlert(
				"Error de Conexión",
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	}
})}
	oninput={() => loginUser.validate()}
	novalidate
>
	<div class="form-fields">
		<div class="form-group">
			<label for="username" class="form-label">Usuario</label>
			<div class="input-wrapper">
				<span class="input-icon-left">
					<User size="16" />
				</span>
				<input
					{...username.as("text")}
					id="username"
					class="form-input"
					placeholder="Introduce tu usuario"
					autocomplete="username"
					disabled={submitting}
					class:has-error={username.issues()?.length}
				>
			</div>
			{#if username.issues()?.length}
				<span class="field-error">
					<CircleAlert size="14" />
					<span>{username.issues()?.[0]?.message}</span>
				</span>
			{/if}
		</div>

		<div class="form-group">
			<label for="password" class="form-label">Contraseña</label>
			<div class="input-wrapper">
				<span class="input-icon-left">
					<Lock size="16" />
				</span>
				<input
					{...password.as(showPassword ? "text" : "password")}
					id="password"
					class="form-input"
					placeholder="••••••••"
					autocomplete="current-password"
					disabled={submitting}
					class:has-error={password.issues()?.length}
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
			{#if password.issues()?.length}
				<span class="field-error">
					<CircleAlert size="14" />
					<span>{password.issues()?.[0]?.message}</span>
				</span>
			{/if}
		</div>
	</div>

	<button type="submit" disabled={submitting} class="submit-btn">
		<span class="btn-inner">
			{#if submitting}
				<LoaderCircle size="18" class="spinner" />
				<span>Autenticando...</span>
			{:else}
				<LogIn size="18" />
				<span>Iniciar Sesión</span>
			{/if}
		</span>
	</button>
</form>

<style>
.login-form {
	display: flex;
	flex-direction: column;
	gap: 1.4rem;
}

.form-fields {
	display: flex;
	flex-direction: column;
	gap: 1rem;
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

.form-input {
	width: 100%;
	min-block-size: 50px;
	padding: 0.92rem 2.85rem;
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(34% 0.02 256.86));
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
		border-color: light-dark(oklch(40% 0.0096 252.81), oklch(82% 0.024 255));
		box-shadow: 0 0 0 3px
			light-dark(oklch(40% 0.02 248 / 0.08), oklch(75% 0.02 255 / 0.12));
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

.submit-btn {
	cursor: pointer;

	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	padding: 0;
	border: 1px solid light-dark(oklch(84% 0.018 236), oklch(34% 0.02 256.86));
	border-radius: 13px;

	font-size: 0.94rem;
	font-weight: 700;
	color: light-dark(oklch(40% 0.0096 252.81), oklch(75% 0.02 255));
	letter-spacing: 0.005em;

	background-color: light-dark(
		oklch(95.534% 0.01042 248.177),
		oklch(31.5% 0.04 256.86)
	);

	transition:
		background-color 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;

	-webkit-tap-highlight-color: transparent;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.72;
	}

	&:hover:not(:disabled) {
		color: light-dark(oklch(25% 0.012 255), oklch(90% 0.01 255));

		background-color: light-dark(oklch(92% 0.015 248), oklch(36% 0.045 256.86));
		border-color: light-dark(oklch(76% 0.025 236), oklch(40% 0.03 256.86));
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
</style>
