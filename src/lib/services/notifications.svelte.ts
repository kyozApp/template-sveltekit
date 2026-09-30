import { nanoid } from "nanoid";

export type NotificationType = "success" | "warning" | "error";

export type ToastPosition =
	| "top-left"
	| "top-right"
	| "top-center"
	| "bottom-left"
	| "bottom-right"
	| "bottom-center";

export interface ToastState {
	id: string;
	show: boolean;
	message: string;
	type: NotificationType;
	duration: number;
	position: ToastPosition;
}

interface AlertState {
	show: boolean;
	title: string;
	message: string;
	type: NotificationType;
}

class NotificationService {
	toasts: ToastState[] = $state([]);

	alert: AlertState = $state({
		show: false,
		title: "Ha ocurrido un error",
		message:
			"Hubo un problema al procesar la solicitud. " +
			"Por favor, revise los datos e intente nuevamente.",
		type: "error",
	});

	confirmState = $state<{
		show: boolean;
		title: string;
		message: string;
		resolve: ((value: boolean) => void) | null;
	}>({
		show: false,
		title: "",
		message: "",
		resolve: null,
	});

	/**
	 * Muestra un Toast (notificación Sonner) de forma interna
	 * agregándolo a la cola.
	 */
	private showToast(
		type: NotificationType,
		message: string,
		duration: number = 3500,
		position: ToastPosition = "bottom-right",
	): void {
		const id = nanoid();

		this.toasts.push({
			id,
			show: true,
			message,
			type,
			duration,
			position,
		});

		// Ocultar automáticamente después del tiempo especificado
		setTimeout(() => {
			this.closeToast(id);
		}, duration);
	}

	/**
	 * Muestra un Alert (modal central) de forma interna.
	 */
	private showAlert(
		type: NotificationType,
		title: string,
		message: string,
	): void {
		this.alert.title = title;
		this.alert.message = message;
		this.alert.type = type;
		this.alert.show = true;
	}

	/** --- API PÚBLICA --- **/

	/** Métodos de Toast (Sonner) **/
	showToastSuccess(
		message: string,
		duration?: number,
		position?: ToastPosition,
	): void {
		this.showToast("success", message, duration, position);
	}

	showToastWarning(
		message: string,
		duration?: number,
		position?: ToastPosition,
	): void {
		this.showToast("warning", message, duration, position);
	}

	showToastError(
		message: string,
		duration?: number,
		position?: ToastPosition,
	): void {
		this.showToast("error", message, duration, position);
	}

	/** Métodos de Alert (Modales) **/
	showSuccessAlert(title: string, message: string): void {
		this.showAlert("success", title, message);
	}

	showWarningAlert(title: string, message: string): void {
		this.showAlert("warning", title, message);
	}

	showErrorAlert(title: string, message: string): void {
		this.showAlert("error", title, message);
	}

	/** Métodos de Confirmación (Modales) **/
	showConfirmAlert(title: string, message: string): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			this.confirmState.title = title;
			this.confirmState.message = message;
			this.confirmState.show = true;
			this.confirmState.resolve = resolve;
		});
	}

	resolveConfirm(value: boolean): void {
		if (this.confirmState.resolve) {
			this.confirmState.resolve(value);
		}
		this.confirmState.show = false;
		this.confirmState.resolve = null;
	}

	/** Controles de Cierre **/
	closeAlert(): void {
		this.alert.show = false;
	}

	closeToast(id?: string): void {
		if (id) {
			this.toasts = this.toasts.filter((t) => t.id !== id);
		} else {
			this.toasts = [];
		}
	}
}

export const notifications: NotificationService = new NotificationService();
