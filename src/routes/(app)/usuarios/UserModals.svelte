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

// Cierra el modal activo retrocediendo en el historial de navegación superficial
const handleCloseModal = () => {
	history.back();
};
</script>

{#if page.state.showUserCreate}
	<FormModal
		isOpen={page.state.showUserCreate.isOpen}
		onRequestClose={handleCloseModal}
		width="medium"
		title="Crear Nuevo Usuario"
		subtitle="Registra un nuevo usuario en la plataforma"
		icon={UserPlus}
	>
		<UserCreateForm onClose={handleCloseModal} />
	</FormModal>
{/if}

{#if page.state.showUserUpdate}
	<FormModal
		isOpen={page.state.showUserUpdate.isOpen}
		onRequestClose={handleCloseModal}
		width="medium"
		title="Editar Usuario"
		subtitle="Modifica los datos y permisos del usuario"
		icon={Pencil}
	>
		<UserUpdateForm
			userId={page.state.showUserUpdate.data.userId}
			{currentUserId}
			onClose={handleCloseModal}
		/>
	</FormModal>
{/if}
