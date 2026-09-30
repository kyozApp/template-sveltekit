import { DATABASE_URL } from "$app/env/private";

import postgres from "@prisma/orm-postgres/runtime";

import type { Contract } from "../../prisma/contract.d";
import contractJson from "../../prisma/contract.json" with { type: "json" };

/**
 * Cliente singleton de base de datos para PostgreSQL con Prisma 8.
 */
export const db = postgres<Contract>({
	contractJson,
	url: DATABASE_URL,
});
