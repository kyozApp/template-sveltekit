import type { Component } from "svelte";

import { LayoutDashboard, UserCog } from "@lucide/svelte";

export interface ManualArticleMeta {
	id: string;
	title: string;
	description: string;
	categoryLabel: string;
	icon: Component;
	minRole?: "ADMIN";
}

export const MANUAL_ARTICLES: ManualArticleMeta[] = [
	{
		id: "dashboard",
		title: "Dashboard",
		description:
			"Panel de control central, navegación, personalización visual y preguntas frecuentes de la plataforma.",
		categoryLabel: "Módulo Principal",
		icon: LayoutDashboard,
	},
	{
		id: "usuarios",
		title: "Usuarios",
		description:
			"Gestión de colaboradores, asignación de perfiles, control de estados y preguntas frecuentes del personal.",
		categoryLabel: "Administración",
		icon: UserCog,
		minRole: "ADMIN",
	},
];
