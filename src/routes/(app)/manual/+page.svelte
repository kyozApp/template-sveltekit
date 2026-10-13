<script lang="ts">
import { fade } from "svelte/transition";
import { page } from "$app/state";

import ConfiguracionArticle from "./configuracion/ConfiguracionArticle.svelte";
import DashboardArticle from "./dashboard/DashboardArticle.svelte";
import ManualHeader from "./ManualHeader.svelte";
import ManualSidebar from "./ManualSidebar.svelte";
import { MANUAL_ARTICLES, type ManualArticleMeta } from "./manual.data";
import PerfilArticle from "./perfil/PerfilArticle.svelte";
import UsuariosArticle from "./usuarios/UsuariosArticle.svelte";

const user = $derived(page.data.user);
const userRole = $derived(user?.role);
const isAdmin = $derived(userRole === "ADMIN");

let activeArticleId = $state("dashboard");

const activeArticle = $derived<ManualArticleMeta>(
	MANUAL_ARTICLES.find((a) => a.id === activeArticleId) ?? MANUAL_ARTICLES[0],
);

// Redirigir a dashboard si un usuario sin rol intenta ver un artículo protegido
$effect(() => {
	if (activeArticle.minRole === "ADMIN" && !isAdmin) {
		activeArticleId = "dashboard";
	}
});

const handleSelectArticle = (id: string) => {
	activeArticleId = id;
};
</script>

<svelte:head>
	<title>{activeArticle.title} · Centro de Ayuda</title>
</svelte:head>

<div class="manual-page">
	<div class="manual-layout">
		<ManualSidebar
			{activeArticleId}
			{userRole}
			onSelectArticle={handleSelectArticle}
		/>

		<main class="manual-reading-pane" aria-label="Contenido del artículo">
			<ManualHeader article={activeArticle} />

			<div class="article-body">
				{#if activeArticleId === "dashboard"}
					<div in:fade={{ duration: 150 }}>
						<DashboardArticle />
					</div>
				{:else if activeArticleId === "perfil"}
					<div in:fade={{ duration: 150 }}>
						<PerfilArticle />
					</div>
				{:else if activeArticleId === "usuarios" && isAdmin}
					<div in:fade={{ duration: 150 }}>
						<UsuariosArticle />
					</div>
				{:else if activeArticleId === "configuracion" && isAdmin}
					<div in:fade={{ duration: 150 }}>
						<ConfiguracionArticle />
					</div>
				{/if}
			</div>
		</main>
	</div>
</div>

<style>
.manual-page {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-bottom: 3rem;
}

.manual-layout {
	display: flex;
	gap: 1.5rem;
	align-items: flex-start;
	width: 100%;

	@media (width <= 960px) {
		flex-direction: column;
	}
}

.manual-reading-pane {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 1.5rem;
	min-width: 0;
	padding: 1.5rem 1.75rem 2.5rem;

	background-color: light-dark(oklch(100% 0 0), oklch(21% 0.018 260));
	border: 1px solid light-dark(oklch(91% 0.01 250), oklch(27% 0.015 260));
	border-radius: 16px;
	box-shadow: 0 4px 20px -2px
		light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.2));

	@media (width <= 640px) {
		padding: 1rem 0.75rem 2rem;
	}
}

.article-body {
	display: flex;
	flex-direction: column;
}
</style>
