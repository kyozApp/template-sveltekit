<script lang="ts">
import { BookOpen } from "@lucide/svelte";

import { MANUAL_ARTICLES } from "./manual.data";

interface Props {
	activeArticleId: string;
	userRole?: string;
	onSelectArticle: (id: string) => void;
}

let { activeArticleId, userRole, onSelectArticle }: Props = $props();

const isAdmin = $derived(userRole === "SUPERADMIN" || userRole === "ADMIN");

const visibleArticles = $derived(
	MANUAL_ARTICLES.filter((article) => {
		if (article.minRole === "ADMIN" && !isAdmin) {
			return false;
		}
		return true;
	}),
);
</script>

<aside class="manual-sidebar no-print" aria-label="Temario del manual">
	<div class="sidebar-header">
		<div class="header-icon">
			<BookOpen size={18} />
		</div>
		<span class="header-title">Índice del Manual</span>
	</div>

	<nav class="articles-nav">
		{#each visibleArticles as article (article.id)}
			{@const IconComponent = article.icon}
			<button
				type="button"
				class="article-link"
				class:active={activeArticleId === article.id}
				onclick={() => onSelectArticle(article.id)}
			>
				<span class="article-icon">
					<IconComponent size={16} />
				</span>
				<span class="article-label">{article.title}</span>
			</button>
		{/each}
	</nav>
</aside>

<style>
.manual-sidebar {
	position: sticky;
	top: 1rem;

	display: flex;
	flex-direction: column;
	gap: 1.25rem;

	width: 290px;
	min-width: 290px;
	max-height: calc(100dvh - 2rem);
	padding: 1.25rem;

	overflow-y: auto;

	background-color: light-dark(oklch(99.2% 0.002 248), oklch(24% 0.028 256.86));
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(32% 0.015 256.86));
	border-radius: 20px;
	box-shadow: 0 4px 20px -4px
		light-dark(oklch(0% 0 0 / 0.03), oklch(0% 0 0 / 0.15));

	@media (width <= 960px) {
		position: static;
		width: 100%;
		min-width: 100%;
		max-height: none;
		overflow-y: visible;
	}
}

.sidebar-header {
	display: flex;
	gap: 0.75rem;
	align-items: center;
	padding-bottom: 1rem;
	border-bottom: 1px solid
		light-dark(oklch(90% 0.008 248), oklch(30% 0.015 256.86));
}

.header-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	color: light-dark(oklch(40% 0.16 250), oklch(78% 0.14 250));
	background-color: light-dark(
		oklch(40% 0.16 250 / 0.08),
		oklch(78% 0.14 250 / 0.15)
	);
	border: 1px solid
		light-dark(oklch(40% 0.16 250 / 0.15), oklch(78% 0.14 250 / 0.25));
	border-radius: 10px;
}

.header-title {
	font-size: 0.92rem;
	font-weight: 750;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.005 255));
	letter-spacing: -0.01em;
}

.articles-nav {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.article-link {
	position: relative;
	display: flex;
	gap: 0.75rem;
	align-items: center;
	width: 100%;
	padding: 0.7rem 0.85rem;
	font-size: 0.86rem;
	font-weight: 600;
	color: light-dark(oklch(40% 0.015 255), oklch(78% 0.01 255));
	text-align: left;
	cursor: pointer;
	background: transparent;
	border: 1px solid transparent;
	border-radius: 12px;
	transition: all 0.16s ease;

	&:hover:not(.active) {
		color: light-dark(oklch(20% 0.02 255), oklch(95% 0.005 255));
		background-color: light-dark(oklch(94% 0.01 248), oklch(28% 0.025 256.86));
	}

	&.active {
		color: light-dark(oklch(22% 0.02 255), oklch(98% 0.005 255));
		background-color: light-dark(oklch(92% 0.02 250), oklch(32% 0.035 256.86));
		border-color: light-dark(oklch(84% 0.03 250), oklch(38% 0.04 256.86));
		box-shadow: 0 1px 3px light-dark(oklch(0% 0 0 / 0.05), oklch(0% 0 0 / 0.2));

		&::before {
			position: absolute;
			top: 25%;
			bottom: 25%;
			left: 0;
			width: 3px;
			content: "";
			background-color: light-dark(oklch(46% 0.18 250), oklch(75% 0.16 250));
			border-radius: 0 4px 4px 0;
		}
	}
}

.article-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: light-dark(oklch(48% 0.05 250), oklch(75% 0.05 250));
	transition: color 0.16s ease;
}

.article-link.active .article-icon {
	color: light-dark(oklch(40% 0.16 250), oklch(80% 0.14 250));
}

.article-label {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
