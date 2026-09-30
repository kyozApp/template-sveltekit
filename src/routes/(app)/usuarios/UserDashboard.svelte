<script lang="ts">
import { page } from "$app/state";

import { Pencil, UserPlus } from "@lucide/svelte";

import FormModal from "#lib/components/ui/modals/FormModal.svelte";

import UserCreateForm from "./UserCreateForm.svelte";
import UserTable from "./UserTable.svelte";
import UserUpdateForm from "./UserUpdateForm.svelte";

interface Props {
	currentUserRole: string;
}

let { currentUserRole }: Props = $props();
</script>

<div class="dashboard-root">
	<UserTable {currentUserRole} />
</div>

{#if page.state.showUserCreate}
	<FormModal
		isOpen={page.state.showUserCreate.isOpen}
		onRequestClose={() => history.back()}
		width="medium"
		title="Crear Nuevo Usuario"
		subtitle="Registra un nuevo usuario en la plataforma"
		icon={UserPlus}
	>
		<UserCreateForm onClose={() => history.back()} />
	</FormModal>
{/if}

{#if page.state.showUserUpdate}
	<FormModal
		isOpen={page.state.showUserUpdate.isOpen}
		onRequestClose={() => history.back()}
		width="medium"
		title="Editar Usuario"
		subtitle="Modifica los datos y permisos del usuario"
		icon={Pencil}
	>
		<UserUpdateForm
			userId={page.state.showUserUpdate.data.userId}
			onClose={() => history.back()}
		/>
	</FormModal>
{/if}

<style>
.dashboard-root {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	width: 100%;
	max-width: 100%;
	padding: 0.5rem 0.5rem 2rem;
	margin: 0;

	color: light-dark(oklch(20% 0.02 255), oklch(91% 0.008 260));
}
</style>
