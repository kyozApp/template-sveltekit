<script lang="ts">
import { ChevronRight } from "@lucide/svelte";

import type { ManualArticleMeta } from "./manual.data";

interface Props {
	article: ManualArticleMeta;
}

let { article }: Props = $props();
</script>

<header class="manual-article-header">
	<nav class="inner-breadcrumbs" aria-label="Navegación del manual">
		<span class="category-badge">{article.categoryLabel}</span>
		<span class="crumb separator"><ChevronRight size={14} /></span>
		<span class="crumb title">{article.title}</span>
	</nav>

	<h1 class="header-title">{article.title}</h1>
	<p class="header-desc">{article.description}</p>
</header>

<style>
.manual-article-header {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding-bottom: 1.5rem;
	margin-bottom: 2rem;
	border-bottom: 1px solid
		light-dark(oklch(90% 0.008 248), oklch(30% 0.015 256.86));
}

.inner-breadcrumbs {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	font-size: 0.78rem;
	font-weight: 650;
	letter-spacing: 0.02em;
}

.category-badge {
	display: inline-flex;
	align-items: center;
	padding: 0.2rem 0.65rem;
	font-size: 0.72rem;
	font-weight: 750;
	color: light-dark(oklch(40% 0.16 250), oklch(78% 0.14 250));
	text-transform: uppercase;
	letter-spacing: 0.06em;
	background-color: light-dark(
		oklch(40% 0.16 250 / 0.08),
		oklch(78% 0.14 250 / 0.14)
	);
	border: 1px solid
		light-dark(oklch(40% 0.16 250 / 0.2), oklch(78% 0.14 250 / 0.25));
	border-radius: 9999px;
}

.crumb.separator {
	display: flex;
	align-items: center;
	color: light-dark(oklch(75% 0.01 255), oklch(45% 0.01 255));
}

.crumb.title {
	color: light-dark(oklch(50% 0.015 255), oklch(70% 0.01 255));
}

.header-title {
	margin: 0;
	font-size: 1.75rem;
	font-weight: 850;
	line-height: 1.25;
	color: light-dark(oklch(18% 0.02 255), oklch(98% 0.005 255));
	letter-spacing: -0.025em;

	@media (width <= 768px) {
		font-size: 1.45rem;
	}
}

.header-desc {
	margin: 0;
	font-size: 0.95rem;
	font-weight: 450;
	line-height: 1.55;
	color: light-dark(oklch(48% 0.015 255), oklch(72% 0.01 255));
}
</style>
