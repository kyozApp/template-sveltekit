import * as v from "valibot";

import { ROLES } from "#lib/constants.ts";

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
