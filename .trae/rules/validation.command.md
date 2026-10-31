---

alwaysApply: false
globs: src/lib/validations/**/*.command.validation.ts
description: Reglas para validaciones command de Valibot.
---

# Validación COMMAND (`x.command.validation.ts`)

Rol único: definir el `body` de una acción imperativa. Si el `command.remote.ts`
hace `return`, este archivo también define `response`.

## Cuándo aplica

Usa este archivo cuando la acción se dispara desde un handler del cliente, por
ejemplo un botón de eliminar, alternar estado o exportar.

## Qué no va aquí

- `params` de lectura: eso pertenece a `validation.query.md`.
- Validación de formularios completos enviados con `<form>`: eso pertenece a
  `validation.form.md`.
- Lógica de negocio, consultas o refresco de caché: eso pertenece al remote.

## Sintaxis

```ts
import * as v from "valibot";

/**
 * Eliminar producto
 */
export const productDeleteSchema = {
	body: v.object({
		productId: v.pipe(
			v.string("El identificador es obligatorio."),
			v.uuid("El identificador no es válido."),
		),
	}),
	response: v.pipe(
		v.object({
			filename: v.string("El nombre del archivo es obligatorio."),
			base64: v.string("El contenido es obligatorio."),
		}),
		v.readonly(),
	),
};

export type ProductDeleteBody = v.InferOutput<typeof productDeleteSchema.body>;
export type ProductDeleteResponse = v.InferOutput<
	typeof productDeleteSchema.response
>;
```

## Reglas

1. Siempre exporta `body`.
2. JSDoc en infinitivo y sin punto final.
3. El tipo inferido se llama `<Accion>Body`.
4. Los mensajes de error van en español con punto final.
5. Si el remote hace `return`, este archivo también exporta `response`.
6. `response` describe exactamente el payload retornado por el remote.
7. Si existe `response`, el tipo inferido se llama `<Accion>Response`.

## Comentarios

En una validación sólo se usa JSDoc:

- `/** ... */` en **infinitivo** y **sin punto final**, encima del schema.

No se usan pasos `// N.` ni `//` simple.

## Checklist de COMMAND

- [ ] El archivo exporta `body`.
- [ ] Si el remote hace `return`, también exporta `response`.
- [ ] El tipo se llama `<Accion>Body`.
- [ ] Los mensajes están en español con punto final.
