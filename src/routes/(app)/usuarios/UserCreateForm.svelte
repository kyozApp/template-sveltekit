<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import {
	CircleAlert,
	Eye,
	EyeOff,
	LoaderCircle,
	Lock,
	Mail,
	Shield,
	User,
	UserPlus,
} from "@lucide/svelte";
import { nanoid } from "nanoid";

import { createUser } from "#lib/remote/user/user.form.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";
import { userCreateSchema } from "#lib/validations/user/user.form.validation.ts";

interface Props {
	onClose: () => void;
}

let { onClose }: Props = $props();

const sessionId = nanoid();

const createForm = createUser.for(sessionId);

const {
	name: fieldName,
	username: fieldUsername,
	email: fieldEmail,
	password: fieldPassword,
	role: fieldRole,
} = createForm.fields;

let showPassword = $state(false);

const submitting = $derived(createForm.pending > 0);

// Alterna la visibilidad de la contraseña entre texto sin formato y oculto
const handleTogglePassword = () => {
	showPassword = !showPassword;
};

// Valida los campos del formulario en tiempo real mientras el usuario escribe
const handleFormInput = () => {
	createForm.validate();
};
</script>

<div
	class="min-h-0 flex-1 overflow-auto overscroll-contain bg-zinc-50 px-5 py-5 sm:px-8 sm:py-6 dark:bg-zinc-950"
>
	<form
		class="flex flex-col gap-5"
		{...createForm.preflight(userCreateSchema.body)}
		{...createForm.enhance(async (f) => {
			try {
				const ok = await f.submit();

				if (ok) {
					const res = f.result;
					if (res && !res.success) {
						notifications.showToastError(res.error);
						return;
					}

					notifications.showToastSuccess("¡Usuario creado correctamente!");
					onClose();
					return;
				}

				console.error("[USER CREATE][PROCESSING ERROR]", { ok });
				notifications.showToastError(
					"Ocurrió un problema inesperado al procesar la creación del usuario. Por favor, comuníquese con sistemas.",
				);
			} catch (e) {
				if (isHttpError(e)) {
					console.error("[USER CREATE][HTTP ERROR]", e);
					notifications.showToastError(
						"No pudimos crear el usuario en este momento. Por favor, comuníquese con sistemas.",
					);
				} else {
					console.error("[USER CREATE][CONNECTION ERROR]", e);
					notifications.showToastError(
						"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
					);
				}
			}
		})}
		oninput={handleFormInput}
		novalidate
	>
		<div class="flex flex-col gap-4">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="flex flex-col gap-2">
					<label
						for="user-create-name"
						class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
					>
						Nombre Completo
					</label>
					<div class="relative flex w-full items-center">
						<span
							class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
						>
							<User size={16} />
						</span>
						<input
							{...fieldName.as("text")}
							id="user-create-name"
							class={[
								"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
								fieldName.issues()?.length &&
									"border-red-500 dark:border-red-400",
							]}
							placeholder="Nombre del usuario"
							autocomplete="name"
							disabled={submitting}
						>
					</div>
					{#if fieldName.issues()?.length}
						<span
							class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
						>
							<CircleAlert size={14} />
							<span>{fieldName.issues()?.[0]?.message}</span>
						</span>
					{/if}
				</div>

				<div class="flex flex-col gap-2">
					<label
						for="user-create-username"
						class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
					>
						Nombre de Usuario
					</label>
					<div class="relative flex w-full items-center">
						<span
							class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
						>
							<User size={16} />
						</span>
						<input
							{...fieldUsername.as("text")}
							id="user-create-username"
							class={[
								"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
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
							class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
						>
							<CircleAlert size={14} />
							<span>{fieldUsername.issues()?.[0]?.message}</span>
						</span>
					{/if}
				</div>

				<div class="flex flex-col gap-2">
					<label
						for="user-create-email"
						class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
					>
						Correo Electrónico
					</label>
					<div class="relative flex w-full items-center">
						<span
							class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
						>
							<Mail size={16} />
						</span>
						<input
							{...fieldEmail.as("text")}
							id="user-create-email"
							class={[
								"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
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
							class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
						>
							<CircleAlert size={14} />
							<span>{fieldEmail.issues()?.[0]?.message}</span>
						</span>
					{/if}
				</div>

				<div class="flex flex-col gap-2">
					<label
						for="user-create-password"
						class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
					>
						Contraseña
					</label>
					<div class="relative flex w-full items-center">
						<span
							class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
						>
							<Lock size={16} />
						</span>
						<input
							{...fieldPassword.as(showPassword ? "text" : "password")}
							id="user-create-password"
							class={[
								"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-11 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
								fieldPassword.issues()?.length &&
									"border-red-500 dark:border-red-400",
							]}
							placeholder="••••••••"
							autocomplete="new-password"
							disabled={submitting}
						>
						<button
							type="button"
							class="absolute right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-zinc-100 p-0 text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
							onclick={handleTogglePassword}
							aria-label={showPassword
								? "Ocultar contraseña"
								: "Mostrar contraseña"}
							disabled={submitting}
						>
							{#if showPassword}
								<EyeOff size={16} />
							{:else}
								<Eye size={16} />
							{/if}
						</button>
					</div>
					{#if fieldPassword.issues()?.length}
						<span
							class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
						>
							<CircleAlert size={14} />
							<span>{fieldPassword.issues()?.[0]?.message}</span>
						</span>
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="user-create-role"
					class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
				>
					Rol del Usuario
				</label>
				<div class="relative flex w-full items-center">
					<span
						class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
					>
						<Shield size={16} />
					</span>
					<select
						{...fieldRole.as("select", "")}
						id="user-create-role"
						class={[
							"min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white py-3 pr-10 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
							fieldRole.issues()?.length &&
								"border-red-500 dark:border-red-400",
						]}
						disabled={submitting}
					>
						<option value="" disabled selected>Selecciona un rol</option>
						<option value="ADMIN">Administrador</option>
						<option value="USER">Usuario</option>
					</select>
				</div>
				{#if fieldRole.issues()?.length}
					<span
						class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
					>
						<CircleAlert size={14} />
						<span>{fieldRole.issues()?.[0]?.message}</span>
					</span>
				{/if}
			</div>
		</div>

		<div class="flex flex-wrap items-center justify-end gap-3 pt-2">
			<button
				type="button"
				class="flex min-w-40 flex-1 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-all duration-200 hover:not-disabled:bg-zinc-100 hover:not-disabled:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-initial dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:not-disabled:bg-zinc-800 dark:hover:not-disabled:text-zinc-100"
				onclick={onClose}
				disabled={submitting}
			>
				<span>Cancelar</span>
			</button>

			<button
				type="submit"
				disabled={submitting}
				class="flex min-w-44 flex-1 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800 px-5 py-3 text-sm font-bold text-zinc-100 transition-all duration-200 hover:not-disabled:border-zinc-700 hover:not-disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-initial dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:not-disabled:border-zinc-600 dark:hover:not-disabled:bg-zinc-700"
			>
				<span class="inline-flex items-center justify-center gap-2">
					{#if submitting}
						<LoaderCircle size={18} class="animate-spin" />
						<span>Guardando...</span>
					{:else}
						<UserPlus size={18} />
						<span>Registrar Usuario</span>
					{/if}
				</span>
			</button>
		</div>
	</form>
</div>
