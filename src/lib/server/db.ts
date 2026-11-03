import { DATABASE_URL } from "$app/env/private";

import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";

import type { Contract } from "../../prisma/contract.d.js";
import contractJson from "../../prisma/contract.json" with { type: "json" };

export const contract = contractFromJson<Contract>(contractJson);

/**
 * Cliente singleton de base de datos para PostgreSQL con Prisma 8.
 */
export const db = postgres({
	contract,
	url: DATABASE_URL,
});
