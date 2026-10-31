---

alwaysApply: false
globs: src/**/*List.svelte,src/**/*Preview.svelte
description: Reglas para componentes de sólo lectura que consumen un remote query — List y Preview.
---

# Componentes QUERY (`XList.svelte` / `XPreview.svelte`)

Rol único: leer datos con un remote `query` y renderizar una lista, una tabla,
un estado vacío o una vista previa. Son componentes **de sólo lectura**: no
mutan nada. Los ejemplos usan el dominio ficticio `product`; sustitúyelo por el
real.

## Cuándo aplica

Usa este archivo cuando el componente sólo consume datos para renderizar una
vista y no dispara mutaciones por sí mismo.

## Qué no va aquí

- `form` y `command` ejecutados en el mismo archivo.
- Apertura y montaje de modales completos: eso pertenece a `modal.domain.md`.
- Lógica de descarga imperativa: eso pertenece a `component.command.md`.

## Estructura base

1. `interface Props { ... }` y `let { ... }: Props = $props();`.
2. Helpers locales documentados con JSDoc.
3. Consulta con `await` dentro de `<svelte:boundary>`.

```svelte
<script lang="ts">
interface Props {
	categoryId: string;
}

let { categoryId }: Props = $props();
</script>
```

## Sintaxis: lista

```svelte
<svelte:boundary>
	{@const list = await getProductList({ categoryId })}

	{#if list.length > 0}
		<!-- Tabla -->
	{:else}
		<!-- Estado vacío -->
	{/if}

	{#snippet pending()}
		<!-- Spinner -->
	{/snippet}

	{#snippet failed()}
		<!-- Error -->
	{/snippet}
</svelte:boundary>
```

## Sintaxis: vista previa

Cuando el `query` devuelve un archivo, el sobre es
`{ success, file, contentType }` con `file` como `ArrayBuffer`. El componente lo
convierte en un Object URL con un helper y lo revoca al desmontar.

```svelte
<svelte:boundary>
	{@const doc = await getProductDocument({ productId })}
	{@const docUrl = doc.file ? createBlobUrl(doc.file) : null}

	{#if docUrl}
		<!-- Vista previa del documento -->
		<iframe src={docUrl} title="Vista previa del documento"></iframe>
	{:else}
		<!-- Sin documento -->
	{/if}

	{#snippet pending()}
		<!-- Spinner -->
	{/snippet}

	{#snippet failed()}
		<!-- Error -->
	{/snippet}
</svelte:boundary>
```

## Reglas

1. `await <query>(...)` va dentro de `<svelte:boundary>` como `{@const ...}`.
2. `pending` y `failed` van dentro del boundary como hijos directos.
3. Este rol sólo consume `query`; no ejecuta `form` ni `command`. Si el listado
   necesita alternar estado, delega en `XStatusToggle.svelte` (ver
   [component.command.md](./component.command.md)).
4. Los modales se disparan con `goto("", { shallow: true, state })` (ver
   [modal.domain.md](./modal.domain.md)).
5. Cálculos auxiliares como formato de fecha o icono por extensión viven como
   helpers locales con JSDoc.
6. Si el `query` devuelve archivo, el sobre es `{ success, file, contentType }`
   con `file` como `ArrayBuffer`; el Object URL se revoca con `onDestroy`.
7. `XPreview.svelte` usa `query` cuando el archivo se representa en pantalla; si
   sólo se descarga por botón, corresponde `command`.

## Comentarios

En un componente se usan tres formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final** para handlers
  (`handleX`) y helpers.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).
- `<!-- -->` para etiquetar secciones de la plantilla.

No se usa `//` simple en el `<script>` ni `//` en la plantilla.

## Checklist de QUERY

- [ ] El archivo es `XList.svelte` o `XPreview.svelte`.
- [ ] El dato se lee con `await <query>(...)` dentro de `<svelte:boundary>`.
- [ ] `pending` y `failed` están dentro del boundary.
- [ ] No mezcla `form` ni `command`.
- [ ] Si hay vista previa, el Object URL se revoca al desmontar.
- [ ] La apertura de modales sigue [modal.domain.md](./modal.domain.md).
