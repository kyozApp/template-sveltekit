import { LayoutDashboard } from "@lucide/svelte";

import type { ManualArticleMeta } from "../manual.data";

export interface DashboardFaq {
	q: string;
	a: string;
}

export const DASHBOARD_FAQS: DashboardFaq[] = [
	{
		q: "¿El cambio entre tema claro y oscuro afecta a los demás usuarios?",
		a: "No. La preferencia de color es 100% individual y se guarda de forma segura en tu navegador. Puedes alternar entre modo oscuro o claro según la iluminación de tu lugar de trabajo sin modificar la vista de tus compañeros.",
	},
	{
		q: "¿Puedo utilizar la plataforma desde una tablet o teléfono móvil?",
		a: "Sí. Toda la aplicación está diseñada para adaptarse automáticamente a pantallas táctiles. El menú lateral se convierte en un panel deslizable y las tablas de datos permiten un desplazamiento horizontal fluido y cómodo.",
	},
	{
		q: "¿Por qué se cerró mi sesión si dejé la pantalla abierta?",
		a: "Para proteger la información confidencial de la empresa ante descuidos en oficinas o equipos compartidos, el sistema cierra automáticamente tu sesión tras un período prolongado de inactividad. Solo debes volver a escribir tu usuario y contraseña.",
	},
	{
		q: "¿A quién debo acudir si experimento un problema técnico o lentitud?",
		a: "Comunícate con el Administrador interno de tu empresa. Si se trata de una incidencia técnica general o de conectividad de red, tu administrador coordinará directamente con el equipo de soporte técnico designado.",
	},
];

export const dashboardArticleMeta: ManualArticleMeta = {
	id: "dashboard",
	title: "Dashboard",
	description:
		"Panel de control central, navegación, personalización visual y preguntas frecuentes de la plataforma.",
	categoryLabel: "Módulo Principal",
	icon: LayoutDashboard,
};
