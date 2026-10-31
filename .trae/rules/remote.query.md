---

alwaysApply: false
globs: src/lib/remote/**/*.query.remote.ts
description: Reglas para remotes query de SvelteKit.
---

# Remote QUERY (`x.query.remote.ts`)

Rol único: leer datos del servidor con `query(...)`. Es el único sabor que usa
`return` como flujo normal del remote.

## Cuándo aplica

Usa este archivo cuando el dato leído se renderiza como lista, detalle, resumen
o vista previa reactiva en la interfaz.

## Qué no va aquí

- Mutaciones de formulario: eso pertenece a `remote.form.md`.
- Acciones imperativas como eliminar, toggle o exportar: eso pertenece a
  `remote.command.md`.
- Toasts, estados de carga visuales o modales: eso pertenece al componente.

## Sintaxis

```ts
import { query } from "$app/server";

import * as v from "valibot";

import { assertPermission } from "#lib/server/auth.ts";
import { db } from "#lib/server/db.ts";
import { productListSchema } from "#lib/validations/product/product.query.validation.ts";

/**
 * Obtiene la lista de productos.
 */
export const getProductList = query(productListSchema.params, async (data) => {
	// 1. Validar permisos
	assertPermission("product:view");

	// 2. Consultar listado
	const rows = await db.orm.public.Product.where({
		categoryId: data.categoryId,
	}).all();

	// 3. Validar y retornar
	const productList = v.parse(productListSchema.response, rows);
	return productList;
});
```

## Reglas

1. Firma: `query(<schema>.params, async (data) => { ... })`. Si la lectura no
   recibe datos, omite `params`: `query(async () => { ... })`.
2. El cierre normal del remote es en dos pasos:
   `const <dato> = v.parse(<schema>.response, result); return <dato>;`.
3. El primer paso valida el acceso. Con permiso de negocio se usa
   `assertPermission("<recurso>:<acción>")` con `// 1. Validar permisos`. Si
   la lectura sólo exige sesión abierta, se usa `assertAuthenticated()` con
   `// 1. Validar autenticación`.
4. No encontrado usa `error(404, "mensaje.")`.
5. Para lecturas de archivo, devolver `{ success, file, contentType }` con
   `file` como `ArrayBuffer`.
6. Todo `return` de un remote debe existir en su validation como `response`.
   En `query` esto aplica siempre, porque su flujo normal sí retorna.
7. Si la lectura no necesita datos de entrada, la firma corta es
   `query(async () => { ... })`.

## Comentarios

En un remote sólo se usan dos formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final**, encima del
  export.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).

No se usa `//` simple en remotes.

## Checklist de QUERY

- [ ] El archivo sólo exporta `query(...)`.
- [ ] Declara `params` sólo si la lectura recibe datos.
- [ ] Usa `return` en dos pasos con `v.parse(...)`.
- [ ] El primer paso valida el acceso (permiso o autenticación).
- [ ] Importa el schema `.query.validation.ts`.
