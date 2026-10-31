---

alwaysApply: false
globs: src/lib/remote/**/*.form.remote.ts
description: Reglas para remotes form de SvelteKit.
---

# Remote FORM (`x.form.remote.ts`)

Rol único: mutar datos con `form(...)`. En el flujo normal no retorna dato; el
refresco dirigido lo hace el propio remote. Los errores de negocio se devuelven
como objeto literal, sin `v.parse`. El único `form` que retorna un payload
validado es el login.

## Cuándo aplica

Usa este archivo cuando la mutación nace en un `<form>` y el componente consume
la instancia con `.for(nanoid())`, `preflight(...)` y `enhance(...)`.

## Qué no va aquí

- Lecturas puras: eso pertenece a `remote.query.md`.
- Acciones imperativas disparadas por botón: eso pertenece a
  `remote.command.md`.
- Construcción de campos, toasts o markup del formulario: eso pertenece al
  componente.

## Sintaxis

```ts
import { form } from "$app/server";

import { assertPermission } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import { productCreateSchema } from "#lib/validations/product/product.form.validation.ts";

import { getProductList } from "./product.query.remote.ts";

/**
 * Registra un nuevo producto.
 */
export const createProduct = form(productCreateSchema.body, async (data) => {
	// 1. Validar permisos
	assertPermission("product:manage");

	// 2. Validar duplicado
	const existing = await db.orm.public.Product.where({
		categoryId: data.categoryId,
		name: data.name,
	}).first();

	if (existing) {
		return {
			success: false,
			error: "El producto ya existe.",
		};
	}

	// 3. Crear registro
	await db.orm.public.Product.create(data);

	// 4. Refrescar listado afectado
	void getProductList({ categoryId: data.categoryId }).refresh();
});
```

## Reglas

1. Firma: `form(<schema>.body, async (data) => { ... })`.
2. `form` no usa `return` en el flujo normal.
3. Los errores de negocio se devuelven como objeto literal
   `{ success: false, error }`, sin `v.parse`.
4. El único `form` que retorna un payload validado es el login: ahí sí se usa
   `const <dato> = v.parse(<schema>.response, payload); return <dato>;` y su
   validation declara `response`.
5. Ese `error` debe venir listo para mostrarse en UI, porque el componente lo
   consume de forma directa como `res.error`.
6. Permisos, existencia y fallos de servidor se comunican con `error(...)`.
7. Cierra con `void <query>(...).refresh()`.
8. El primer paso valida el acceso. Con permiso de negocio se usa
   `assertPermission("<recurso>:<acción>")` con `// 1. Validar permisos`. Si
   la mutación sólo exige sesión abierta, se usa `assertAuthenticated()` con
   `// 1. Validar autenticación`.

## Comentarios

En un remote sólo se usan dos formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final**, encima del
  export.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).

No se usa `//` simple en remotes.

## Checklist de FORM

- [ ] El archivo sólo exporta `form(...)`.
- [ ] El primer paso valida el acceso (permiso o autenticación).
- [ ] No usa `return` en el flujo normal.
- [ ] Los errores de negocio se devuelven como objeto literal, sin `v.parse`.
- [ ] Sólo el login declara `response` y valida su payload con `v.parse`.
- [ ] Importa el schema `.form.validation.ts`.
- [ ] Refresca el query afectado.
