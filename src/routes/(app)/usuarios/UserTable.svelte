<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { goto } from "$app/navigation";

import { LoaderCircle, Mail, Pencil, Trash } from "@lucide/svelte";

import { ROLE_LABELS } from "#lib/constants.ts";
import {
	deleteUser,
	toggleUserStatus,
} from "#lib/remote/user/user.command.remote.ts";
import { getUserList } from "#lib/remote/user/user.query.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface Props {
	currentUser: App.AuthenticatedLocals["user"];
}

let { currentUser }: Props = $props();

let deletingUserId = $state<string | null>(null);
let togglingUserId = $state<string | null>(null);

// Determina si el usuario en sesión tiene permisos para alternar el estado del usuario objetivo
const canToggleUserStatus = (targetUser: { id: string; role: string }) => {
	if (targetUser.id === currentUser.id) {
		return false;
	}
	return currentUser.role === "ADMIN";
};

// Determina si el usuario en sesión tiene permisos para editar al usuario objetivo
const canEditUser = (_targetUser: { id: string; role: string }) => {
	return currentUser.role === "ADMIN";
};

// Determina si el usuario en sesión tiene permisos para eliminar al usuario objetivo
const canDeleteUser = (targetUser: { id: string; role: string }) => {
	if (currentUser.role !== "ADMIN") {
		return false;
	}
	if (targetUser.id === currentUser.id) {
		return false;
	}
	return true;
};

// Abre el modal para editar el usuario seleccionado mediante navegación superficial
const handleOpenUpdateModal = (userId: string) => {
	goto("", {
		shallow: true,
		state: {
			showUserUpdate: { isOpen: true, data: { userId } },
		},
	});
};

// Solicita confirmación y ejecuta la eliminación del usuario en el sistema
const handleDeleteUser = async (userToDelete: { id: string; name: string }) => {
	if (deletingUserId) return;

	const confirmed = await notifications.showConfirmAlert(
		"Eliminar Usuario",
		`¿Estás seguro de que deseas dar de baja a "${userToDelete.name}"? El usuario será eliminado del sistema y sus sesiones serán canceladas.`,
	);

	if (!confirmed) return;

	deletingUserId = userToDelete.id;
	try {
		await deleteUser({ id: userToDelete.id });
		notifications.showToastSuccess(
			`Usuario "${userToDelete.name}" eliminado con éxito.`,
		);
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[USER DELETE][HTTP ERROR]", e);
			notifications.showToastError(
				"No se pudo eliminar al usuario. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[USER DELETE][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	} finally {
		deletingUserId = null;
	}
};

// Alterna el estado activo o inactivo del usuario en el sistema
const handleToggleStatus = async (userToToggle: {
	id: string;
	isActive: boolean;
}) => {
	if (togglingUserId) return;
	togglingUserId = userToToggle.id;

	try {
		await toggleUserStatus({
			id: userToToggle.id,
			isActive: !userToToggle.isActive,
		});

		notifications.showToastSuccess(
			`Usuario ${!userToToggle.isActive ? "activado" : "desactivado"} con éxito.`,
		);
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[USER TOGGLE STATUS][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos cambiar el estado del usuario en este momento. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[USER TOGGLE STATUS][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	} finally {
		togglingUserId = null;
	}
};
</script>

<svelte:boundary>
	{@const list = await getUserList()}

	<!-- Vista Móvil: Tarjeta Contenedora Única (Grouped Inset List) -->
	<div
		class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:hidden dark:border-zinc-800 dark:bg-zinc-900"
	>
		<div class="divide-y divide-zinc-200 dark:divide-zinc-800">
			{#each list as user, index (user.id)}
				<div
					class="flex flex-col gap-3 p-4 transition-colors duration-150 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30"
				>
					<!-- Fila Superior: #ID, @usuario, Tú, y Estado badge -->
					<div class="flex items-center justify-between gap-2">
						<div class="flex flex-wrap items-center gap-2">
							<span
								class="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500"
							>
								#{index + 1}
							</span>
							<span
								class="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
							>
								@{user.username}
							</span>
							{#if user.id === currentUser.id}
								<span
									class="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
								>
									Tú
								</span>
							{/if}
						</div>

						<span
							class={[
								"inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase",
								user.isActive
									? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
									: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
							]}
						>
							{user.isActive ? "Activo" : "Inactivo"}
						</span>
					</div>

					<!-- Nombre del usuario y Rol -->
					<div class="flex flex-col gap-1.5">
						<div class="flex items-baseline justify-between gap-2">
							<h3
								class={[
									"text-base font-bold tracking-tight",
									user.isActive
										? "text-zinc-900 dark:text-zinc-100"
										: "text-zinc-400 dark:text-zinc-500",
								]}
							>
								{user.name}
							</h3>
							<span
								class={[
									"inline-flex shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tracking-wider uppercase",
									user.role === "ADMIN"
										? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
										: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
								]}
							>
								{ROLE_LABELS[user.role]}
							</span>
						</div>

						<!-- Correo Electrónico -->
						<div
							class="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400"
						>
							<Mail
								size={14}
								class="shrink-0 text-zinc-400 dark:text-zinc-500"
							/>
							<span class="truncate">{user.email}</span>
						</div>
					</div>

					<!-- Acciones y Control de Estado -->
					<div
						class="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80"
					>
						<!-- Interruptor de Estado -->
						<div class="flex items-center gap-2">
							<span class="text-xs font-medium text-zinc-500 dark:text-zinc-400"
								>Estado:</span
							>
							{#if canToggleUserStatus(user)}
								<button
									type="button"
									onclick={() => handleToggleStatus(user)}
									role="switch"
									aria-checked={user.isActive}
									aria-label="Alternar estado del usuario"
									disabled={togglingUserId === user.id}
									class={[
										"relative inline-flex h-6.5 w-11.5 shrink-0 cursor-pointer items-center rounded-full border border-zinc-300 p-0.5 transition-colors duration-250 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700",
										user.isActive
											? "bg-emerald-600 dark:bg-emerald-500"
											: "bg-zinc-200 dark:bg-zinc-800",
									]}
								>
									<span
										class={[
											"size-5 rounded-full bg-white shadow-md transition-transform duration-250 ease-in-out dark:bg-zinc-100",
											user.isActive ? "translate-x-5" : "translate-x-0.5",
										]}
									></span>
									<span class="sr-only">
										Estado del usuario: {user.isActive ? "Activo" : "Inactivo"}
									</span>
								</button>
							{:else}
								<span
									class="text-xs font-semibold text-zinc-400 dark:text-zinc-500"
								>
									{user.id === currentUser.id ? "Tu cuenta" : "Protegido"}
								</span>
							{/if}
						</div>

						<!-- Botones de Acción -->
						<div class="flex items-center gap-2">
							{#if canEditUser(user)}
								<button
									type="button"
									class="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
									onclick={() => handleOpenUpdateModal(user.id)}
									aria-label="Editar usuario"
								>
									<Pencil size={15} />
								</button>
							{/if}
							{#if canDeleteUser(user)}
								<button
									type="button"
									class="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-55 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
									onclick={() => handleDeleteUser(user)}
									aria-label="Eliminar usuario"
									disabled={deletingUserId === user.id}
								>
									{#if deletingUserId === user.id}
										<LoaderCircle
											size={15}
											class="animate-spin text-red-600 dark:text-red-400"
										/>
									{:else}
										<Trash size={15} />
									{/if}
								</button>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<div class="p-8 text-center">
					<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
						No se encontraron usuarios registrados.
					</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Vista Escritorio: Tabla completa -->
	<div
		class="hidden overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm md:block dark:border-zinc-800 dark:bg-zinc-900"
	>
		<table class="w-full border-collapse text-left">
			<thead>
				<tr
					class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80"
				>
					<th
						class="w-16 min-w-16 px-5 py-4 text-xs font-bold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
					>
						Item
					</th>
					<th
						class="min-w-50 px-5 py-4 text-xs font-bold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
					>
						Nombre
					</th>
					<th
						class="min-w-44 px-5 py-4 text-xs font-bold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
					>
						Usuario
					</th>
					<th
						class="min-w-64 px-5 py-4 text-xs font-bold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
					>
						Correo electrónico
					</th>
					<th
						class="min-w-40 px-5 py-4 text-center text-xs font-bold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
					>
						Rol
					</th>
					<th
						class="w-28 min-w-28 px-5 py-4 text-center text-xs font-bold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
					>
						Estado
					</th>
					<th
						class="w-28 min-w-28 px-5 py-4 text-center text-xs font-bold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
					>
						Acciones
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
				{#each list as user, index (user.id)}
					<tr
						class="transition-colors duration-150 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
					>
						<td
							class="px-5 py-4 text-sm font-medium text-zinc-500 dark:text-zinc-400"
						>
							{index + 1}
						</td>
						<td class="px-5 py-4">
							<div class="inline-flex items-center gap-2">
								<span
									class={[
										"text-sm font-semibold",
										user.isActive
											? "text-zinc-900 dark:text-zinc-100"
											: "text-zinc-400 dark:text-zinc-500",
									]}
								>
									{user.name}
								</span>
								{#if user.id === currentUser.id}
									<span
										class="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
									>
										Tú
									</span>
								{/if}
							</div>
						</td>
						<td
							class="px-5 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-300"
						>
							{user.username}
						</td>
						<td
							class="px-5 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							{user.email}
						</td>
						<td class="px-5 py-4 text-center">
							<span
								class={[
									"inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase",
									user.role === "ADMIN"
										? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
										: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
								]}
							>
								{ROLE_LABELS[user.role]}
							</span>
						</td>
						<td class="px-5 py-4 text-center">
							{#if canToggleUserStatus(user)}
								<button
									type="button"
									onclick={() => handleToggleStatus(user)}
									role="switch"
									aria-checked={user.isActive}
									aria-label="Alternar estado del usuario"
									disabled={togglingUserId === user.id}
									class={[
										"relative inline-flex h-7.5 w-13.5 shrink-0 cursor-pointer items-center rounded-full border border-zinc-300 p-0.5 transition-colors duration-250 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700",
										user.isActive
											? "bg-emerald-600 dark:bg-emerald-500"
											: "bg-zinc-200 dark:bg-zinc-800",
									]}
								>
									<span
										class={[
											"size-6 rounded-full bg-white shadow-md transition-transform duration-250 ease-in-out dark:bg-zinc-100",
											user.isActive ? "translate-x-6" : "translate-x-0.5",
										]}
									></span>
									<span class="sr-only">
										Estado del usuario: {user.isActive ? "Activo" : "Inactivo"}
									</span>
								</button>
							{:else}
								<span
									class={[
										"inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase",
										user.isActive
											? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
											: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
									]}
								>
									{user.isActive ? "Activo" : "Inactivo"}
								</span>
							{/if}
						</td>
						<td class="px-5 py-4 text-center">
							<div class="inline-flex items-center justify-center gap-2">
								{#if canEditUser(user)}
									<button
										type="button"
										class="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 p-0 text-zinc-600 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-55 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
										onclick={() => handleOpenUpdateModal(user.id)}
										aria-label="Editar usuario"
										data-tooltip="Editar usuario"
										data-tooltip-position="top-end"
									>
										<Pencil size={16} />
									</button>
								{/if}
								{#if canDeleteUser(user)}
									<button
										type="button"
										class="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 p-0 text-zinc-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-55 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
										onclick={() => handleDeleteUser(user)}
										aria-label="Eliminar usuario"
										data-tooltip="Eliminar usuario"
										data-tooltip-position="top-end"
										disabled={deletingUserId === user.id}
									>
										{#if deletingUserId === user.id}
											<LoaderCircle
												size={16}
												class="animate-spin text-red-600 dark:text-red-400"
											/>
										{:else}
											<Trash size={16} />
										{/if}
									</button>
								{/if}
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td
							class="px-5 py-12 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
							colspan={7}
						>
							No se encontraron usuarios registrados.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#snippet pending()}
		<div
			class="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<LoaderCircle
				size={20}
				class="animate-spin text-zinc-600 dark:text-zinc-400"
			/>
			<span class="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
				Cargando usuarios...
			</span>
		</div>
	{/snippet}

	{#snippet failed()}
		<div
			class="flex items-center justify-center rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-zinc-900"
		>
			<div class="text-sm font-semibold text-red-600 dark:text-red-400">
				Error al cargar los usuarios. Por favor, recarga la página.
			</div>
		</div>
	{/snippet}
</svelte:boundary>
