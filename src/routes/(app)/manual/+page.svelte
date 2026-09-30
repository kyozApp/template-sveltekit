<script lang="ts">
import { fade } from "svelte/transition";
import { page } from "$app/state";

import DashboardArticle from "./articles/DashboardArticle.svelte";
import UsuariosArticle from "./articles/UsuariosArticle.svelte";
import ManualHeader from "./ManualHeader.svelte";
import ManualSidebar from "./ManualSidebar.svelte";
import { MANUAL_ARTICLES, type ManualArticleMeta } from "./manual.data";

const user = $derived(page.data.user);
const userRole = $derived(user?.role);
const isAdmin = $derived(userRole === "SUPERADMIN" || userRole === "ADMIN");

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
				{:else if activeArticleId === "usuarios" && isAdmin}
					<div in:fade={{ duration: 150 }}>
						<UsuariosArticle />
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
	flex: 1;
	min-width: 0;
	padding: 2.25rem 2.5rem;

	background-color: light-dark(oklch(99.2% 0.002 248), oklch(24% 0.028 256.86));
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(32% 0.015 256.86));
	border-radius: 20px;
	box-shadow: 0 4px 20px -4px
		light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.15));

	@media (width <= 768px) {
		padding: 1.5rem 1.15rem;
	}
}

.article-body {
	min-height: 450px;
}
</style>
