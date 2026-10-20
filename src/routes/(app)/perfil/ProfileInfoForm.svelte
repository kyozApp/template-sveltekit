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

// Valida los campos del formulario en tiempo real
const handleFormInput = () => {
	profileForm.validate();
};
</script>

<div
	class="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-900"
>
	<div class="flex flex-col gap-1">
		<h2 class="text-base font-bold text-zinc-900 dark:text-zinc-50">
			Información Personal
		</h2>
		<p class="text-xs text-zinc-500 dark:text-zinc-400">
			Actualiza tu nombre completo, usuario y correo electrónico de contacto.
		</p>
	</div>

	<form
		class="flex flex-col gap-6"
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

				console.error("[PROFILE UPDATE][PROCESSING ERROR]", { ok });
				notifications.showToastError(
					"Ocurrió un error al procesar la actualización. Por favor, revisa los datos.",
				);
			} catch (e) {
				if (isHttpError(e)) {
					console.error("[PROFILE UPDATE][HTTP ERROR]", e);
					notifications.showToastError(
						"No pudimos actualizar tu perfil en este momento. Por favor, comunícate con sistemas.",
					);
				} else {
					console.error("[PROFILE UPDATE][CONNECTION ERROR]", e);
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
					for="profile-name"
					class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
				>
					Nombre Completo
				</label>
				<div class="relative flex w-full items-center">
					<span
						class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 dark:text-zinc-400"
					>
						<User size={16} />
					</span>
					<input
						{...fieldName.as("text", initialData.name)}
						id="profile-name"
						class={[
							"min-h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
							fieldName.issues()?.length &&
								"border-red-500 dark:border-red-400",
						]}
						placeholder="Tu nombre completo"
						autocomplete="name"
						disabled={submitting}
					>
				</div>
				{#if fieldName.issues()?.length}
					<span
						class="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<CircleAlert size={14} />
						<span>{fieldName.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="profile-username"
					class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
				>
					Nombre de Usuario
				</label>
				<div class="relative flex w-full items-center">
					<span
						class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 dark:text-zinc-400"
					>
						<User size={16} />
					</span>
					<input
						{...fieldUsername.as("text", initialData.username)}
						id="profile-username"
						class={[
							"min-h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
							fieldUsername.issues()?.length &&
								"border-red-500 dark:border-red-400",
						]}
						placeholder="usuario123"
						autocomplete="username"
						disabled={submitting}
					>
				</div>
				{#if fieldUsername.issues()?.length}
					<span
						class="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<CircleAlert size={14} />
						<span>{fieldUsername.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="profile-email"
					class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
				>
					Correo Electrónico
				</label>
				<div class="relative flex w-full items-center">
					<span
						class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 dark:text-zinc-400"
					>
						<Mail size={16} />
					</span>
					<input
						{...fieldEmail.as("text", initialData.email)}
						id="profile-email"
						class={[
							"min-h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
							fieldEmail.issues()?.length &&
								"border-red-500 dark:border-red-400",
						]}
						placeholder="correo@ejemplo.com"
						autocomplete="email"
						disabled={submitting}
					>
				</div>
				{#if fieldEmail.issues()?.length}
					<span
						class="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<CircleAlert size={14} />
						<span>{fieldEmail.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>
		</div>

		<div class="flex justify-end pt-1">
			<button
				type="submit"
				class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:not-disabled:border-blue-700 hover:not-disabled:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-500 dark:bg-blue-600 dark:hover:not-disabled:border-blue-600 dark:hover:not-disabled:bg-blue-500"
				disabled={submitting}
				aria-label="Guardar cambios de perfil"
			>
				{#if submitting}
					<LoaderCircle size={16} class="animate-spin" />
					<span>Guardando...</span>
				{:else}
					<Save size={16} />
					<span>Guardar Cambios</span>
				{/if}
			</button>
		</div>
	</form>
</div>
