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

// Alterna la visibilidad de la contraseña actual
const handleToggleCurrent = () => {
	showCurrent = !showCurrent;
};

// Alterna la visibilidad de la nueva contraseña
const handleToggleNew = () => {
	showNew = !showNew;
};

// Alterna la visibilidad de la confirmación de contraseña
const handleToggleConfirm = () => {
	showConfirm = !showConfirm;
};

// Valida los campos del formulario en tiempo real
const handleFormInput = () => {
	passwordForm.validate();
};
</script>

<div
	class="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-900"
>
	<div class="flex flex-col gap-1">
		<h2 class="text-base font-bold text-zinc-900 dark:text-zinc-50">
			Seguridad y Contraseña
		</h2>
		<p class="text-xs text-zinc-500 dark:text-zinc-400">
			Actualiza tu contraseña periódicamente para mantener tu cuenta protegida.
			Al cambiarla, se cerrarán las sesiones activas en otros dispositivos.
		</p>
	</div>

	<form
		bind:this={formEl}
		class="flex flex-col gap-6"
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

				console.error("[PROFILE PASSWORD][PROCESSING ERROR]", { ok });
				notifications.showToastError(
					"Ocurrió un error al procesar el cambio de contraseña. Por favor, verifica los campos.",
				);
			} catch (e) {
				if (isHttpError(e)) {
					console.error("[PROFILE PASSWORD][HTTP ERROR]", e);
					notifications.showToastError(
						"No pudimos cambiar tu contraseña en este momento. Por favor, comunícate con sistemas.",
					);
				} else {
					console.error("[PROFILE PASSWORD][CONNECTION ERROR]", e);
					notifications.showToastError(
						"No se pudo establecer comunicación con el servidor.",
					);
				}
			}
		})}
		oninput={handleFormInput}
		novalidate
	>
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
			<div class="flex flex-col gap-2 sm:col-span-2">
				<label
					for="profile-current-password"
					class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
				>
					Contraseña Actual
				</label>
				<div class="relative flex w-full items-center">
					<span
						class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 dark:text-zinc-400"
					>
						<Lock size={16} />
					</span>
					<input
						{...fieldCurrent.as(showCurrent ? "text" : "password")}
						id="profile-current-password"
						class={[
							"min-h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-11 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
							fieldCurrent.issues()?.length &&
								"border-red-500 dark:border-red-400",
						]}
						placeholder="••••••••"
						autocomplete="current-password"
						disabled={submitting}
					>
					<button
						type="button"
						class="absolute right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-zinc-100 p-0 text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
						onclick={handleToggleCurrent}
						aria-label={showCurrent
							? "Ocultar contraseña actual"
							: "Mostrar contraseña actual"}
						disabled={submitting}
					>
						{#if showCurrent}
							<EyeOff size={16} />
						{:else}
							<Eye size={16} />
						{/if}
					</button>
				</div>
				{#if fieldCurrent.issues()?.length}
					<span
						class="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<CircleAlert size={14} />
						<span>{fieldCurrent.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="profile-new-password"
					class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
				>
					Nueva Contraseña
				</label>
				<div class="relative flex w-full items-center">
					<span
						class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 dark:text-zinc-400"
					>
						<KeyRound size={16} />
					</span>
					<input
						{...fieldNew.as(showNew ? "text" : "password")}
						id="profile-new-password"
						class={[
							"min-h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-11 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
							fieldNew.issues()?.length && "border-red-500 dark:border-red-400",
						]}
						placeholder="••••••••"
						autocomplete="new-password"
						disabled={submitting}
					>
					<button
						type="button"
						class="absolute right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-zinc-100 p-0 text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
						onclick={handleToggleNew}
						aria-label={showNew
							? "Ocultar nueva contraseña"
							: "Mostrar nueva contraseña"}
						disabled={submitting}
					>
						{#if showNew}
							<EyeOff size={16} />
						{:else}
							<Eye size={16} />
						{/if}
					</button>
				</div>
				{#if fieldNew.issues()?.length}
					<span
						class="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<CircleAlert size={14} />
						<span>{fieldNew.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="profile-confirm-password"
					class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
				>
					Confirmar Nueva Contraseña
				</label>
				<div class="relative flex w-full items-center">
					<span
						class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 dark:text-zinc-400"
					>
						<ShieldCheck size={16} />
					</span>
					<input
						{...fieldConfirm.as(showConfirm ? "text" : "password")}
						id="profile-confirm-password"
						class={[
							"min-h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-11 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
							fieldConfirm.issues()?.length &&
								"border-red-500 dark:border-red-400",
						]}
						placeholder="••••••••"
						autocomplete="new-password"
						disabled={submitting}
					>
					<button
						type="button"
						class="absolute right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-zinc-100 p-0 text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
						onclick={handleToggleConfirm}
						aria-label={showConfirm
							? "Ocultar confirmación de contraseña"
							: "Mostrar confirmación de contraseña"}
						disabled={submitting}
					>
						{#if showConfirm}
							<EyeOff size={16} />
						{:else}
							<Eye size={16} />
						{/if}
					</button>
				</div>
				{#if fieldConfirm.issues()?.length}
					<span
						class="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<CircleAlert size={14} />
						<span>{fieldConfirm.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>
		</div>

		<div class="flex justify-end pt-1">
			<button
				type="submit"
				class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-800 px-5 py-2.5 text-xs font-bold text-zinc-100 transition-all duration-200 hover:not-disabled:border-zinc-700 hover:not-disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:not-disabled:border-zinc-600 dark:hover:not-disabled:bg-zinc-700"
				disabled={submitting}
				aria-label="Actualizar contraseña"
			>
				{#if submitting}
					<LoaderCircle size={16} class="animate-spin" />
					<span>Actualizando...</span>
				{:else}
					<Lock size={16} />
					<span>Actualizar Contraseña</span>
				{/if}
			</button>
		</div>
	</form>
</div>
