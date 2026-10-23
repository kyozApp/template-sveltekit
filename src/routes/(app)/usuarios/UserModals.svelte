<script lang="ts">
import { page } from "$app/state";

import { Pencil, UserPlus } from "@lucide/svelte";

import FormModal from "#lib/components/ui/modals/FormModal.svelte";

import UserCreateForm from "./UserCreateForm.svelte";
import UserUpdateForm from "./UserUpdateForm.svelte";

interface Props {
	currentUserId: string;
}

let { currentUserId }: Props = $props();
</script>

<!-- Crear nuevo usuario -->
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

<!-- Editar usuario existente -->
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
			{currentUserId}
			onClose={() => history.back()}
		/>
	</FormModal>
{/if}
