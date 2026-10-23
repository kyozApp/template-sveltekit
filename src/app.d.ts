import type { SessionUser } from "#lib/constants.ts";

declare global {
	namespace App {
		// Definimos la interfaz Locals para todas las rutas
		interface Locals {
			user: SessionUser | null;
			sessionToken: string | null;
		}
		// Definimos la interfaz AuthenticatedLocals para rutas autenticadas
		interface AuthenticatedLocals extends App.Locals {
			user: SessionUser;
			sessionToken: string;
		}
		// Definimos PageData para páginas y layouts
		interface PageData {}
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
