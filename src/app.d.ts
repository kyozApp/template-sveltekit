import type { Role } from "#lib/constants.ts";

interface User {
	id: string;
	name: string;
	username: string;
	email: string;
	role: Role;
}

declare global {
	namespace App {
		// Definimos la interfaz Locals para todas las rutas
		interface Locals {
			user: User | null;
			sessionToken: string | null;
		}
		// Definimos la interfaz AuthenticatedLocals para rutas autenticadas
		interface AuthenticatedLocals extends App.Locals {
			user: User;
			sessionToken: string;
		}
		// Definimos PageData para páginas y layouts
		interface PageData {
			user?: User;
		}
		// Definimos la interfaz PageState para Shallow Routing
		interface PageState {
			// Usuarios
			showUserCreate?: {
				isOpen: boolean;
			};
			showUserUpdate?: {
				isOpen: boolean;
				data: {
					userId: string;
				};
			};
		}
	}
}
