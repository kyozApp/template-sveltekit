<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { refreshAll } from "$app/navigation";

import {
	ChevronDown,
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

import { ROLE_LABELS } from "#lib/constants.ts";
import { updateUser } from "#lib/remote/user/user.form.remote.ts";
import { getUserDetails } from "#lib/remote/user/user.query.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";
import { userUpdateSchema } from "#lib/validations/user/user.form.validation.ts";

interface Props {
	userId: string;
	currentUserId: string;
	onClose: () => void;
}

let { userId, currentUserId, onClose }: Props = $props();

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

// Alterna la visibilidad de la contraseña entre texto sin formato y oculto
const handleTogglePassword = () => {
	showPassword = !showPassword;
};

// Valida los campos del formulario en tiempo real mientras el usuario escribe
const handleFormInput = () => {
	updateForm.validate();
};

// Quita el foco del selector al elegir una opción para restaurar la orientación de la flecha
const handleRoleChange = (e: Event) => {
	(e.currentTarget as HTMLSelectElement).blur();
};
</script>

<svelte:boundary>
	{@const details = await getUserDetails({ id: userId })}
	{@const isActiveChecked = fieldIsActive.value() ?? details.isActive}

	<div
		class="min-h-0 flex-1 overflow-auto overscroll-contain bg-zinc-50 px-5 py-5 sm:px-8 sm:py-6 dark:bg-zinc-950"
	>
		<form
			class="flex flex-col gap-5"
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

						notifications.showToastSuccess(
							"¡Usuario actualizado correctamente!",
						);
						await refreshAll();
						onClose();
						return;
					}

					console.error("[USER UPDATE][PROCESSING ERROR]", { ok });
					notifications.showToastError(
						"Ocurrió un problema inesperado al actualizar el usuario. Por favor, comuníquese con sistemas.",
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
			oninput={handleFormInput}
			novalidate
		>
			<div class="flex flex-col gap-4">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label
							for="user-update-name"
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
								{...fieldName.as("text", details.name)}
								id="user-update-name"
								class={[
									"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
									fieldName.issues()?.length &&
										"border-red-500 dark:border-red-400",
								]}
								placeholder="Nombre del usuario"
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
							for="user-update-username"
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
								{...fieldUsername.as("text", details.username)}
								id="user-update-username"
								class={[
									"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
									fieldUsername.issues()?.length &&
										"border-red-500 dark:border-red-400",
								]}
								placeholder="ej. jperez"
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
				</div>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label
							for="user-update-email"
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
								{...fieldEmail.as("email", details.email)}
								id="user-update-email"
								class={[
									"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-4 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
									fieldEmail.issues()?.length &&
										"border-red-500 dark:border-red-400",
								]}
								placeholder="ejemplo@empresa.com"
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
							for="user-update-password"
							class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
						>
							Nueva Contraseña (Opcional)
						</label>
						<div class="relative flex w-full items-center">
							<span
								class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
							>
								<Lock size={16} />
							</span>
							<input
								{...fieldPassword.as(showPassword ? "text" : "password")}
								id="user-update-password"
								class={[
									"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-12 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
									fieldPassword.issues()?.length &&
										"border-red-500 dark:border-red-400",
								]}
								placeholder="Dejar en blanco para mantener actual"
								disabled={submitting}
							>
							<button
								type="button"
								class="absolute right-3.5 flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-zinc-400 transition-colors duration-150 hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-zinc-300"
								onclick={handleTogglePassword}
								disabled={submitting}
								aria-label={showPassword
									? "Ocultar contraseña"
									: "Mostrar contraseña"}
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
						for="user-update-role"
						class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
					>
						Rol del Usuario
					</label>

					{#if currentUserId === details.id}
						<input {...fieldRole.as("hidden", details.role)}>
						<div
							class="relative flex min-h-12 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white py-3 pr-4 pl-11 dark:border-zinc-800 dark:bg-zinc-900"
						>
							<span
								class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
							>
								<Shield size={16} />
							</span>
							<span
								class="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100"
							>
								{ROLE_LABELS[details.role]}
							</span>
							<span
								class="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold tracking-wider text-zinc-600 uppercase dark:bg-zinc-800 dark:text-zinc-300"
							>
								Rol protegido
							</span>
						</div>
					{:else}
						<div class="relative flex w-full items-center">
							<span
								class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
							>
								<Shield size={16} />
							</span>
							<select
								{...fieldRole.as("select", details.role)}
								id="user-update-role"
								class={[
									"peer min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white bg-none py-3 pr-10 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
									fieldRole.issues()?.length &&
										"border-red-500 dark:border-red-400",
								]}
								onchange={handleRoleChange}
								disabled={submitting}
							>
								<option value="ADMIN">Administrador</option>
								<option value="USER">Usuario</option>
							</select>
							<span
								class="pointer-events-none absolute right-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-transform duration-200 peer-focus:rotate-180 dark:text-zinc-400"
							>
								<ChevronDown size={16} />
							</span>
						</div>
						{#if fieldRole.issues()?.length}
							<span
								class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
							>
								<CircleAlert size={14} />
								<span>{fieldRole.issues()?.[0]?.message}</span>
							</span>
						{/if}
					{/if}
				</div>

				<div
					class="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
				>
					<div class="flex items-center gap-3">
						<div
							class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
						>
							<User size={16} />
						</div>
						<div class="flex flex-col gap-0.5">
							<span
								class="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
							>
								Estado de la cuenta
							</span>
							<div>
								<span
									class={[
										"inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase transition-colors duration-200",
										isActiveChecked
											? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
											: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
									]}
								>
									{isActiveChecked ? "Cuenta activa" : "Cuenta inactiva"}
								</span>
							</div>
						</div>
					</div>

					{#if currentUserId === details.id}
						<input {...fieldIsActive.as("hidden", details.isActive)}>
					{:else}
						<label
							class={[
								"relative inline-flex h-7.5 w-13.5 shrink-0 cursor-pointer items-center rounded-full border border-zinc-300 p-0.5 transition-colors duration-250 ease-in-out has-disabled:cursor-not-allowed has-disabled:opacity-50 dark:border-zinc-700",
								isActiveChecked
									? "bg-emerald-600 dark:bg-emerald-500"
									: "bg-zinc-200 dark:bg-zinc-800",
							]}
						>
							<input
								{...fieldIsActive.as("checkbox", details.isActive)}
								class="sr-only"
								disabled={submitting}
							>
							<span
								class={[
									"size-6 rounded-full bg-white shadow-md transition-transform duration-250 ease-in-out dark:bg-zinc-100",
									isActiveChecked ? "translate-x-6" : "translate-x-0.5",
								]}
							></span>
							<span class="sr-only">Estado de la cuenta</span>
						</label>
					{/if}
				</div>

				{#if currentUserId === details.id}
					<div
						class="flex items-center gap-2.5 rounded-xl border border-amber-300/30 bg-amber-500/10 p-3 text-xs leading-relaxed font-medium text-amber-700 dark:text-amber-300"
					>
						<TriangleAlert size={16} class="shrink-0" />
						<span>
							Por seguridad, no puedes modificar tu propio rol ni desactivar tu
							sesión actual.
						</span>
					</div>
				{/if}
			</div>

			<input {...fieldId.as("hidden", userId)}>

			<div class="flex flex-wrap items-center justify-end gap-3 pt-2">
				<button
					type="button"
					class="flex min-w-40 flex-1 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition-all duration-200 hover:not-disabled:bg-zinc-100 hover:not-disabled:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-initial dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:not-disabled:bg-zinc-800 dark:hover:not-disabled:text-zinc-100"
					onclick={onClose}
					disabled={submitting}
				>
					Cancelar
				</button>
				<button
					type="submit"
					class="flex min-w-44 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-800 px-6 py-3 text-sm font-bold text-zinc-100 transition-all duration-200 hover:not-disabled:border-zinc-700 hover:not-disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-initial dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:not-disabled:border-zinc-600 dark:hover:not-disabled:bg-zinc-700"
					disabled={submitting}
				>
					{#if submitting}
						<LoaderCircle size={18} class="animate-spin" />
						<span>Actualizando...</span>
					{:else}
						<Pencil size={18} />
						<span>Guardar Cambios</span>
					{/if}
				</button>
			</div>
		</form>
	</div>

	{#snippet pending()}
		<div
			class="flex flex-col items-center justify-center gap-3 p-12 text-zinc-500 dark:text-zinc-400"
		>
			<LoaderCircle
				size={32}
				class="animate-spin text-zinc-600 dark:text-zinc-400"
			/>
			<span class="text-sm font-medium">Cargando datos del usuario...</span>
		</div>
	{/snippet}

	{#snippet failed()}
		<div
			class="flex flex-col items-center justify-center gap-3 p-8 text-center text-red-600 dark:text-red-400"
		>
			<CircleAlert size={32} />
			<p class="text-sm font-medium">
				No se pudieron cargar los datos del usuario.
			</p>
			<button
				type="button"
				class="mt-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
				onclick={onClose}
			>
				Cerrar
			</button>
		</div>
	{/snippet}
</svelte:boundary>
