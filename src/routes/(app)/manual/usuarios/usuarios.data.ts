import { UserCog } from "@lucide/svelte";

import type { ManualArticleMeta } from "../manual.data";

export interface UserFaq {
	q: string;
	a: string;
}

export const USUARIOS_FAQS: UserFaq[] = [
	{
		q: "¿Qué debo hacer si un colaborador olvida su contraseña?",
		a: "No es necesario eliminar su cuenta ni crear una nueva. Haz clic en el botón 'Editar' (icono de lápiz) en su fila, escribe una nueva clave en el campo 'Nueva Contraseña' y presiona Guardar. La nueva clave entrará en vigor de inmediato.",
	},
	{
		q: "¿Por qué el sistema me impide desactivar o eliminar mi propia cuenta?",
		a: "Por política estricta de seguridad informática, la plataforma bloquea los botones de suspensión y eliminación en el usuario con el que te encuentras conectado. Esto previene que la empresa se quede accidentalmente sin ningún administrador con acceso al sistema.",
	},
	{
		q: "¿Qué ocurre si aparece una alerta roja indicando que el correo ya existe?",
		a: "Cada dirección de correo electrónico debe ser única en todo el sistema. Si el correo ya fue registrado anteriormente (incluso por un usuario inactivo), deberás utilizar una dirección alternativa o reactivar la cuenta previa si aún existe.",
	},
	{
		q: "¿Por qué un usuario con perfil Consulta no puede editar ni borrar?",
		a: "El perfil Consulta está pensado para supervisión y auditoría. El sistema bloquea automáticamente cualquier intento de modificación para evitar errores operativos o pérdida accidental de información.",
	},
	{
		q: "¿Al retirar a un colaborador se borran las operaciones que realizó en el pasado?",
		a: "No. El retiro anula permanentemente el inicio de sesión y cierra sus sesiones activas, pero todas las transacciones, ventas o registros históricos que haya creado se conservan intactos para fines contables y de auditoría.",
	},
];

export const usuariosArticleMeta: ManualArticleMeta = {
	id: "usuarios",
	title: "Usuarios",
	description:
		"Gestión de colaboradores, asignación de perfiles, control de estados y preguntas frecuentes del personal.",
	categoryLabel: "Administración",
	icon: UserCog,
	minRole: "ADMIN",
};
