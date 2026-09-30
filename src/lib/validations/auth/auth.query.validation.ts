import * as v from "valibot";

import { ROLES } from "#lib/constants";

/**
 * Verificación del estado de autenticación (Watchdog / Layout)
 */
export const authCheckSchema = {
	response: v.pipe(
		v.union([
			v.object({
				authenticated: v.literal(false),
			}),
			v.object({
				authenticated: v.literal(true),
				user: v.object({
					id: v.pipe(v.string(), v.uuid()),
					role: v.picklist(ROLES),
				}),
			}),
		]),
		v.readonly(),
	),
};

/**
 * Resumen estadístico de requerimientos enviados pendientes de respuesta
 */
export const authPendingUnansweredSchema = {
	response: v.pipe(
		v.object({
			total: v.pipe(v.number(), v.minValue(0)),
			memoCount: v.pipe(v.number(), v.minValue(0)),
			processCount: v.pipe(v.number(), v.minValue(0)),
		}),
		v.readonly(),
	),
};
