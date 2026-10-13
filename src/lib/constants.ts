/**
 * Constantes y Enums Maestros del Dominio de la Aplicación.
 *
 * Fuente Única de Verdad (Single Source of Truth) para:
 * 1. Base de datos (Prisma contract)
 * 2. Validación (Valibot schemas)
 * 3. Tipos y Servidor (SvelteKit)
 */

// --- Roles de Usuario ---
export const ROLES = ["ADMIN", "USER"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
	ADMIN: "Administrador",
	USER: "Usuario",
};

// --- Entornos de Ejecución ---
export const NODE_ENVS = ["development", "production"] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];
