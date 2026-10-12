import type { Component } from "svelte";

import { configuracionArticleMeta } from "./configuracion/configuracion.data";
import { dashboardArticleMeta } from "./dashboard/dashboard.data";
import { perfilArticleMeta } from "./perfil/perfil.data";
import { usuariosArticleMeta } from "./usuarios/usuarios.data";

export interface ManualArticleMeta {
	id: string;
	title: string;
	description: string;
	categoryLabel: string;
	icon: Component;
	minRole?: "ADMIN";
}

export const MANUAL_ARTICLES: ManualArticleMeta[] = [
	dashboardArticleMeta,
	perfilArticleMeta,
	usuariosArticleMeta,
	configuracionArticleMeta,
];
