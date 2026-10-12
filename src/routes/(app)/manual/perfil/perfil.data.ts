import { UserCircle } from "@lucide/svelte";

import type { ManualArticleMeta } from "../manual.data";

export interface PerfilFaq {
	q: string;
	a: string;
}

export const PERFIL_FAQS: PerfilFaq[] = [
	{
		q: "¿Qué ocurre si cambio mi contraseña desde Mi Perfil?",
		a: "Al actualizar tu contraseña, el sistema renueva tus credenciales y cierra automáticamente cualquier otra sesión abierta en otros dispositivos por motivos de seguridad.",
	},
	{
		q: "¿Puedo revocar una sesión abierta en otra computadora?",
		a: "Sí. En la sección 'Dispositivos y Sesiones Activas' puedes ver todos los dispositivos donde tu cuenta está iniciada y cerrar el acceso individualmente en los que no reconozcas.",
	},
	{
		q: "¿Los usuarios con rol Consulta pueden cambiar su información personal?",
		a: "Sí. Todo usuario autenticado, independientemente de su nivel de acceso o rol en la empresa, tiene derecho a gestionar sus datos personales y mantener su clave al día.",
	},
];

export const perfilArticleMeta: ManualArticleMeta = {
	id: "perfil",
	title: "Mi Perfil",
	description:
		"Gestión de datos de cuenta, cambio seguro de contraseña y supervisión de sesiones abiertas.",
	categoryLabel: "Cuenta Personal",
	icon: UserCircle,
};
