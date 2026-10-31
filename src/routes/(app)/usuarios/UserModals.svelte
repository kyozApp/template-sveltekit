<script lang="ts">
import { page } from "$app/state";

import { Pencil, Trash, UserPlus } from "@lucide/svelte";

import FormModal from "#lib/components/ui/modals/FormModal.svelte";

import UserCreateForm from "./UserCreateForm.svelte";
import UserDeleteForm from "./UserDeleteForm.svelte";
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

<!-- Eliminar usuario existente -->
{#if page.state.showUserDelete}
	<FormModal
		isOpen={page.state.showUserDelete.isOpen}
		onRequestClose={() => history.back()}
		width="medium"
		title="Eliminar Usuario"
		subtitle="Confirma la baja permanente del usuario"
		icon={Trash}
	>
		<UserDeleteForm
			userId={page.state.showUserDelete.data.userId}
			userName={page.state.showUserDelete.data.userName}
			onClose={() => history.back()}
		/>
	</FormModal>
{/if}
