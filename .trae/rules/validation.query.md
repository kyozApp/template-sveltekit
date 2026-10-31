---

alwaysApply: false
globs: src/lib/validations/**/*.query.validation.ts
description: Reglas para validaciones query de Valibot.
---

# Validación QUERY (`x.query.validation.ts`)

Rol único: definir `response` de una lectura y, sólo si la lectura recibe
datos, `params`.

## Cuándo aplica

Usa este archivo cuando el remote sólo lee datos y devuelve un payload para
renderizar una lista, una vista previa o un resumen.

## Qué no va aquí

- `body` de formularios: eso pertenece a `validation.form.md`.
- `body` de acciones imperativas: eso pertenece a `validation.command.md`.
- Mutaciones, permisos o acceso a base de datos: eso pertenece al remote.

## Sintaxis

```ts
import * as v from "valibot";

/**
 * Listar productos por categoría
 */
export const productListSchema = {
	params: v.object({
		categoryId: v.pipe(
			v.string("El ID de categoría es obligatorio."),
			v.uuid("El ID de categoría no es válido."),
		),
	}),
	response: v.array(
		v.pipe(
			v.object({
				id: v.pipe(v.string(), v.uuid()),
				name: v.string(),
			}),
			v.readonly(),
		),
	),
};

export type ProductListParams = v.InferOutput<typeof productListSchema.params>;
export type ProductListItemResponse = v.InferOutput<
	typeof productListSchema.response
>[number];
```

Si la lectura no recibe datos, omite `params`:

```ts
export const productSummarySchema = {
	response: v.pipe(
		v.object({
			total: v.number(),
		}),
		v.readonly(),
	),
};
```

## Reglas

1. Exporta `response`; exporta `params` sólo cuando la lectura recibe datos.
2. `response` describe exactamente lo que devuelve el remote.
3. `v.readonly()` se usa como pipe action:
   `v.pipe(v.object({...}), v.readonly())`.
4. Las fechas serializadas van como `v.pipe(v.string(), v.isoTimestamp())`.
5. Para archivos, el sobre es `{ success, file, contentType }` con `file` como
   `v.nullable(v.instance(ArrayBuffer))`.
6. Si `response` es una colección, el item tipado se deriva del propio
   `response`, no de un schema separado.

## Comentarios

En una validación sólo se usa JSDoc:

- `/** ... */` en **infinitivo** y **sin punto final**, encima del schema.

No se usan pasos `// N.` ni `//` simple.

## Checklist de QUERY

- [ ] El archivo exporta `response` (y `params` sólo si recibe datos).
- [ ] `v.readonly()` se usa como pipe action, nunca como wrapper.
- [ ] Los tipos siguen `<Accion>Params` y `<Accion>Response`.
