---

alwaysApply: false
globs: src/lib/validations/**/*.form.validation.ts
description: Reglas para validaciones form de Valibot.
---

# Validación FORM (`x.form.validation.ts`)

Rol único: definir el `body` de un formulario. Los errores de negocio no se
validan: sólo el login, que retorna un payload, define además `response`.

## Cuándo aplica

Usa este archivo cuando la mutación se dispara desde un `<form>` mejorado con
`preflight(...)` + `enhance(...)`.

## Qué no va aquí

- `params` de lectura: eso pertenece a `validation.query.md`.
- Validación de acciones imperativas disparadas por botón: eso pertenece a
  `validation.command.md`.
- Lógica de base de datos, autenticación o refresco: eso pertenece al remote.

## Sintaxis

```ts
import * as v from "valibot";

/**
 * Registrar producto
 */
export const productCreateSchema = {
	body: v.object({
		categoryId: v.pipe(
			v.string("El ID de categoría es obligatorio."),
			v.uuid("El ID de categoría no es válido."),
		),
	}),
};

export type ProductCreateBody = v.InferOutput<typeof productCreateSchema.body>;
```

Sólo el login retorna un payload validado, así que sólo ese `form` define
`response`:

```ts
export const authLoginSchema = {
	body: v.object({
		username: v.pipe(v.string(), v.nonEmpty("El usuario es obligatorio.")),
		password: v.pipe(v.string(), v.nonEmpty("La contraseña es obligatoria.")),
	}),
	response: v.pipe(
		v.object({
			token: v.string(),
		}),
		v.readonly(),
	),
};

export type AuthLoginResponse = v.InferOutput<typeof authLoginSchema.response>;
```

## Reglas

1. Siempre exporta `body`.
2. Sólo el login exporta `response`; describe el payload que retorna su `form`.
3. Los errores de negocio no se validan: se devuelven como objeto literal.
4. JSDoc en infinitivo y sin punto final.
5. Los tipos inferidos se llaman `<Accion>Body` y, si aplica,
   `<Accion>Response`.
6. Para archivos usar `v.file(...)`, `v.mimeType(...)` y `v.maxSize(...)`.
7. Validaciones cruzadas con `v.forward(v.partialCheck(...), [...])`.

## Comentarios

En una validación sólo se usa JSDoc:

- `/** ... */` en **infinitivo** y **sin punto final**, encima del schema.

No se usan pasos `// N.` ni `//` simple.

## Checklist de FORM

- [ ] El archivo exporta `body`.
- [ ] Sólo el login exporta `response`.
- [ ] El tipo se llama `<Accion>Body`.
- [ ] Los mensajes están en español con punto final.
