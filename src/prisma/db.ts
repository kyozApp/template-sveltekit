import "dotenv/config";

import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";

import type { Contract } from "./contract.d.js";
import contractJson from "./contract.json" with { type: "json" };

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL no está configurada en las variables de entorno.",
	);
}

export const contract = contractFromJson<Contract>(contractJson);

/**
 * Cliente singleton de base de datos para scripts/worker con Prisma 8.
 */
export const db = postgres({
	contract,
	url: databaseUrl,
});
