---

alwaysApply: false
globs: src/lib/remote/**/*.command.remote.ts
description: Reglas para remotes command de SvelteKit.
---

# Remote COMMAND (`x.command.remote.ts`)

Rol único: mutar datos imperativamente con `command(...)`. Se consume desde un
handler del cliente, no desde un `<form>`. En el flujo normal no retorna dato.
Los `return` en `command` son excepciones, y esas excepciones también deben
existir en `schema.response` dentro de su validation.

## Cuándo aplica

Usa este archivo cuando la acción nace en un evento imperativo del cliente:
`onclick`, un toggle, una exportación o una confirmación sin `<form>`.

## Qué no va aquí

- Lecturas para renderizado: eso pertenece a `remote.query.md`.
- Formularios mejorados con `enhance(...)`: eso pertenece a `remote.form.md`.
- Estado visual del botón, toasts y accesibilidad: eso pertenece al componente.

## Sintaxis

### Flujo normal

```ts
import { error } from "@sveltejs/kit";
import { command } from "$app/server";

import { assertPermission } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import { productDeleteSchema } from "#lib/validations/product/product.command.validation.ts";

import { getProductList } from "./product.query.remote.ts";

/**
 * Elimina un producto.
 */
export const deleteProduct = command(productDeleteSchema.body, async (data) => {
	// 1. Validar permisos
	assertPermission("product:manage");

	// 2. Validar existencia
	const existing = await db.orm.public.Product.where({
		id: data.productId,
		categoryId: data.categoryId,
	}).first();

	if (!existing) {
		error(404, "El producto no se encontró.");
	}

	// 3. Eliminar registro
	await db.orm.public.Product.where({
		id: data.productId,
		categoryId: data.categoryId,
	}).deleteAll();

	// 4. Refrescar listado afectado
	void getProductList({ categoryId: data.categoryId }).refresh();
});
```

### Excepción con `return`

Si un `command` necesita devolver un payload al cliente, sigue siendo una
excepción rara. En ese caso, el archivo `.command.validation.ts` también define
`response`.

```ts
import { command } from "$app/server";

import * as v from "valibot";

import { assertPermission } from "#lib/server/auth.ts";
import { downloadReportSchema } from "#lib/validations/product/product.command.validation.ts";

/**
 * Descarga un reporte del producto.
 */
export const downloadProductReport = command(
	downloadReportSchema.body,
	async (data) => {
		// 1. Validar permisos
		assertPermission("product:view");

		// 2. Construir payload excepcional de descarga
		const downloadResult = v.parse(downloadReportSchema.response, {
			filename: "reporte.pdf",
			base64: "JVBERi0xLjcK...",
		});
		return downloadResult;
	},
);
```

## Reglas

1. Firma: `command(<schema>.body, async (data) => { ... })`.
2. `command` no usa `return` en el flujo normal.
3. Los `return` en `command` son excepciones.
4. Toda excepción con `return` exige `response` en el schema del archivo
   `.command.validation.ts`.
5. El flujo normal del `command` es el primer ejemplo: valida, muta y refresca,
   sin `return`.
6. La excepción típica es un payload que el cliente necesita consumir
   directamente, por ejemplo una descarga.
7. Si existe esa excepción, su validation también define `response`.
8. Si aparece `return`, el payload se valida en dos pasos:
   `const <dato> = v.parse(<schema>.response, payload); return <dato>;`.
9. Los fallos se comunican con `error(status, "mensaje.")`.
10. Cierra con `void <query>(...).refresh()` cuando la mutación afecta listados.
11. No usar `command` para datos de vista previa persistente; eso corresponde a
    `query`.
12. El primer paso valida el acceso. Con permiso de negocio se usa
    `assertPermission("<recurso>:<acción>")` con `// 1. Validar permisos`. Si
    la acción sólo exige sesión abierta, se usa `assertAuthenticated()` con
    `// 1. Validar autenticación`.

## Comentarios

En un remote sólo se usan dos formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final**, encima del
  export.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).

No se usa `//` simple en remotes.

## Checklist de COMMAND

- [ ] El archivo sólo exporta `command(...)`.
- [ ] El primer paso valida el acceso (permiso o autenticación).
- [ ] No usa `return` en el flujo normal.
- [ ] El archivo documenta el flujo normal y, si aplica, la excepción con
  `return`.
- [ ] Si aparece `return`, se trata de una excepción documentada.
- [ ] Si hay `return`, existe `response` en el schema `.command.validation.ts`.
- [ ] La excepción retorna sólo el payload que el cliente necesita consumir.
- [ ] Si hay `return`, usa `const <dato> = v.parse(...); return <dato>;`.
- [ ] Importa el schema `.command.validation.ts`.
- [ ] Usa `error(...)` para los fallos.
- [ ] Refresca el query afectado.
