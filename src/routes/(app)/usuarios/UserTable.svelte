<script lang="ts">
import { page } from "$app/state";

import { LoaderCircle } from "@lucide/svelte";

import { getUserList } from "#lib/remote/user/user.query.remote";

import UserDeleteButton from "./UserDeleteButton.svelte";
import UserRoleCell from "./UserRoleCell.svelte";
import UserToggleStatusButton from "./UserToggleStatusButton.svelte";
import UserUpdateButton from "./UserUpdateButton.svelte";

interface Props {
	currentUserRole: string;
}

let { currentUserRole }: Props = $props();

const canToggleUserStatus = (targetUser: { id: string; role: string }) => {
	if (
		targetUser.role === "SUPERADMIN" ||
		targetUser.id === page.data.user?.id
	) {
		return false;
	}
	return currentUserRole === "SUPERADMIN" || currentUserRole === "ADMIN";
};

const canEditUser = (targetUser: { id: string; role: string }) => {
	if (targetUser.role === "SUPERADMIN") {
		return currentUserRole === "SUPERADMIN";
	}
	return currentUserRole === "SUPERADMIN" || currentUserRole === "ADMIN";
};

const canDeleteUser = (targetUser: { id: string; role: string }) => {
	if (currentUserRole !== "SUPERADMIN" && currentUserRole !== "ADMIN") {
		return false;
	}
	if (
		targetUser.role === "SUPERADMIN" ||
		targetUser.id === page.data.user?.id
	) {
		return false;
	}
	return true;
};
</script>

<div class="table-responsive">
	<table class="data-table">
		<thead>
			<tr class="table-row">
				<th class="table-head col-index">Item</th>
				<th class="table-head col-user">Nombre</th>
				<th class="table-head col-username">Usuario</th>
				<th class="table-head col-email">Correo electrónico</th>
				<th class="table-head col-role">Rol</th>
				<th class="table-head col-status">Estado</th>
				<th class="table-head col-actions text-center">Acciones</th>
			</tr>
		</thead>
		<tbody>
			<svelte:boundary>
				{@const list = await getUserList()}

				{#each list as user, index (user.id)}
					<tr class="user-row table-row">
						<td class="col-index table-cell">
							{index + 1}
						</td>
						<td class="col-user table-cell">
							<div class="user-details">
								<span class="user-name" class:inactive={!user.isActive}
									>{user.name}</span
								>
							</div>
						</td>
						<td class="col-username table-cell">
							<span class="mono">{user.username}</span>
						</td>
						<td class="col-email table-cell">
							<span class="email">{user.email}</span>
						</td>
						<td class="col-role table-cell">
							<UserRoleCell role={user.role} />
						</td>
						<td class="col-status table-cell">
							{#if canToggleUserStatus(user)}
								<div class="status-cell">
									<UserToggleStatusButton
										userId={user.id}
										isActive={user.isActive}
									/>
									<span class="status-text" class:active={user.isActive}>
										{user.isActive ? "Activo" : "Inactivo"}
									</span>
								</div>
							{:else}
								<span class="status-pill" data-active={user.isActive}>
									{user.isActive ? "Activo" : "Inactivo"}
								</span>
							{/if}
						</td>
						<td class="col-actions table-cell text-center">
							<div class="actions-group">
								{#if canEditUser(user)}
									<UserUpdateButton userId={user.id} />
								{/if}
								{#if canDeleteUser(user)}
									<UserDeleteButton userId={user.id} userName={user.name} />
								{/if}
								{#if !canEditUser(user) && !canDeleteUser(user)}
									<span class="lock-hint" aria-hidden="true">—</span>
								{/if}
							</div>
						</td>
					</tr>
				{/each}

				{#snippet pending()}
					<tr class="table-row">
						<td class="table-feedback-cell table-cell" colspan={7}>
							<div class="table-loading-state">
								<LoaderCircle size={20} class="spinner" />
								<span>Cargando usuarios...</span>
							</div>
						</td>
					</tr>
				{/snippet}

				{#snippet failed()}
					<tr class="table-row">
						<td class="table-feedback-cell table-cell" colspan={7}>
							<div class="table-error-state">
								Error al cargar los usuarios. Por favor, recarga la página.
							</div>
						</td>
					</tr>
				{/snippet}
			</svelte:boundary>
		</tbody>
	</table>
</div>

<style>
.table-responsive {
	overflow-x: auto;

	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);

	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(27% 0.015 260));
	border-radius: 24px;
}

.data-table {
	width: 100%;
	min-width: 1080px;
	border-spacing: 0;
	border-collapse: separate;
}

.table-head {
	padding: 1rem 1.45rem;

	font-size: 0.74rem;
	font-weight: 700;
	line-height: 1.25;
	color: light-dark(oklch(43% 0.01 255), oklch(74% 0.008 255));
	text-align: left;
	text-transform: uppercase;
	letter-spacing: 0.06em;

	background-color: light-dark(
		oklch(98.1% 0.004 248),
		oklch(22.8% 0.027 256.86)
	);
	border-block-end: 1px solid
		light-dark(oklch(90% 0.006 248), oklch(27% 0.015 260));

	&:first-child {
		border-top-left-radius: 24px;
	}

	&:last-child {
		border-top-right-radius: 24px;
	}

	@media (width <= 768px) {
		padding: 0.9rem 1rem;
	}
}

.table-cell {
	padding: 1rem 1.45rem;

	font-size: 0.92rem;
	font-weight: 500;
	line-height: 1.45;
	vertical-align: middle;
	color: light-dark(oklch(23% 0.012 255), oklch(95% 0.004 255));
	border-block-end: 1px solid
		light-dark(oklch(91% 0.006 248), oklch(26% 0.014 260));

	&:last-child {
		text-align: right;
	}

	@media (width <= 768px) {
		padding: 0.9rem 1rem;
	}
}

.table-row {
	transition: background-color 0.18s ease;

	&:hover {
		background-color: light-dark(oklch(98% 0.003 248), oklch(27% 0.032 256.86));
	}
}

.user-row:last-child .table-cell {
	border-block-end: none;
}

.table-feedback-cell {
	padding: 0;
}

.col-index {
	inline-size: 64px;
	min-inline-size: 64px;
}

.col-user {
	min-inline-size: 240px;
}

.col-username {
	min-inline-size: 170px;
}

.col-email {
	min-inline-size: 270px;
}

.col-role {
	min-inline-size: 160px;
}

.col-status {
	min-inline-size: 130px;
}

.col-actions {
	inline-size: 110px;
	min-inline-size: 110px;
	text-align: center;
}

.actions-group {
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
	justify-content: center;
}

.status-cell {
	display: inline-flex;
	gap: 0.6rem;
	align-items: center;
}

.status-text {
	font-size: 0.78rem;
	font-weight: 600;
	color: light-dark(oklch(50% 0.02 255), oklch(65% 0.01 255));

	&.active {
		color: light-dark(oklch(45% 0.15 145), oklch(75% 0.15 145));
	}
}

.user-details {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.user-name {
	font-size: 0.95rem;
	font-weight: 680;
	color: light-dark(oklch(23% 0.012 255), oklch(95% 0.004 255));

	&.inactive {
		color: light-dark(oklch(40% 0.008 255), oklch(82% 0.012 255));
		text-decoration: none;
	}
}

.mono {
	font-family: var(--font-mono);
	font-size: 0.88rem;
	color: light-dark(oklch(34% 0.01 255), oklch(82% 0.008 255));
}

.email {
	font-size: 0.9rem;
	font-weight: 500;
	color: light-dark(oklch(45% 0.04 250), oklch(74% 0.035 250));
}

.status-pill {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	padding: 0.28rem 0.72rem;

	font-size: 0.68rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;

	background-color: light-dark(oklch(97.6% 0.004 248), oklch(22.5% 0.018 255));
	border-radius: 999px;

	&[data-active="true"] {
		color: light-dark(oklch(43% 0.072 150), oklch(68% 0.072 150));
		background-color: light-dark(oklch(95.8% 0.022 150), oklch(28% 0.024 150));
	}

	&[data-active="false"] {
		color: light-dark(oklch(47% 0.075 20), oklch(71% 0.075 20));
		background-color: light-dark(oklch(95.9% 0.022 20), oklch(28% 0.024 20));
	}
}

.lock-hint {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	inline-size: 38px;
	block-size: 38px;

	font-size: 0.95rem;
	font-weight: 700;
	color: light-dark(oklch(55% 0.008 255), oklch(63% 0.016 255));

	background-color: light-dark(
		oklch(98.1% 0.004 248),
		oklch(27.5% 0.032 256.86)
	);
	border: 1px solid light-dark(oklch(90% 0.006 248), oklch(27% 0.015 260));
	border-radius: 12px;
}

.table-loading-state,
.table-error-state {
	display: flex;
	gap: 0.75rem;
	align-items: center;
	justify-content: center;

	padding: 3rem 1rem;

	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.45;
	text-align: center;
}

.table-loading-state {
	color: light-dark(oklch(49% 0.008 255), oklch(71% 0.008 255));
}

.table-loading-state :global(.spinner) {
	animation: spin-1s-table-loading-state 1s linear infinite;
}

.table-error-state {
	color: light-dark(oklch(52% 0.12 25), oklch(66% 0.08 25));
}

@keyframes spin-1s-table-loading-state {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
