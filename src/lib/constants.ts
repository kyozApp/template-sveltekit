/**
 * Constantes, Enums y Tipos Maestros del Dominio de la Aplicación.
 *
 * Fuente Única de Verdad (Single Source of Truth) para:
 * 1. Base de datos (Prisma contract)
 * 2. Validación (Valibot schemas)
 * 3. Tipos, Servidor y Cliente (SvelteKit)
 */

// --- Roles de Usuario ---
export const ROLES = ["ADMIN", "USER"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
	ADMIN: "Administrador",
	USER: "Usuario",
};

// --- Permisos de Usuario ---
export const PERMISSIONS = [
	"users:view",
	"users:manage",
	"settings:manage",
	"manual:view",
	"manual:users:view",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
	ADMIN: [
		"users:view",
		"users:manage",
		"settings:manage",
		"manual:view",
		"manual:users:view",
	],
	USER: ["manual:view"],
};

/**
 * Determina si un rol posee un permiso concreto.
 */
export const hasPermission = (role: Role, permission: Permission): boolean =>
	ROLE_PERMISSIONS[role].includes(permission);

// --- Entornos de Ejecución ---
export const NODE_ENVS = ["development", "production"] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

// --- Entidad de Sesión de Usuario ---
export interface SessionUser {
	id: string;
	name: string;
	username: string;
	email: string;
	role: Role;
}
