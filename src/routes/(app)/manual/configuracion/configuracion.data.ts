import { Settings } from "@lucide/svelte";

import type { ManualArticleMeta } from "../manual.data";

export interface ConfigFaq {
	q: string;
	a: string;
}

export const CONFIGURACION_FAQS: ConfigFaq[] = [
	{
		q: "¿Quiénes tienen acceso al módulo de Configuración?",
		a: "Únicamente usuarios con nivel de acceso Administrador o Superadministrador. La plataforma redirige automáticamente a cualquier usuario sin privilegios que intente acceder.",
	},
	{
		q: "¿Cómo se añaden nuevas tablas maestras o catálogos?",
		a: "El módulo de Configuración está preparado para alojar nuevas pestañas con tablas maestras del negocio (empresas, líneas de servicio, conceptos de facturación) siguiendo el patrón de pestañas modulares.",
	},
	{
		q: "¿Qué función cumple el Worker SSR?",
		a: "Es un proceso en segundo plano que corre de forma autónoma con Cron. Su labor principal es la depuración de sesiones vencidas a las 03:00 AM para mantener óptimo el rendimiento de la base de datos.",
	},
];

export const configuracionArticleMeta: ManualArticleMeta = {
	id: "configuracion",
	title: "Configuración",
	description:
		"Parámetros globales del aplicativo, políticas criptográficas de seguridad y monitoreo operacional.",
	categoryLabel: "Administración",
	icon: Settings,
	minRole: "ADMIN",
};
