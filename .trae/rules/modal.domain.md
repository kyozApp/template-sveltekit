---

alwaysApply: false
globs: src/**/*Modals.svelte,src/**/*List.svelte,src/routes/**/+page.svelte
description: Reglas para el consumo de modales de dominio — botones que publican page.state y montaje en XModals.svelte.
---

# Modales de dominio (`*Modals.svelte` y consumidores)

Rol único: coordinar la apertura y el montaje de modales del dominio. El
consumidor publica `page.state`; el orquestador `XModals.svelte` lo lee y monta
el casco con su formulario o componente.

Los ejemplos usan un dominio ficticio `product`; sustitúyelo por el real.

## Cuándo aplica

Usa este archivo cuando el cambio toca la apertura de un modal desde una lista,
una página o una vista de detalle, o cuando se monta un `XModals.svelte`.

## Qué no va aquí

- El kit base de `ui/modals/`: eso pertenece a `modal.base.md`.
- La lógica del formulario o del toggle montado dentro del modal.
- Reglas de lectura de datos o mutaciones: eso pertenece a los componentes y
  remotes del dominio.

## 1. Apertura desde el consumidor

Un **consumidor** es cualquier componente que publique `page.state` para abrir
un modal: una lista, una tabla, una barra de acciones, el encabezado de la
página o una vista de detalle.

Esta regla **no fija la posición** del disparador. Dónde vive el botón es una
decisión de diseño de cada dominio y no se norma aquí. Lo que sí es obligatorio
es **cómo** se publica el estado: la forma del disparador es idéntica en todas
las ubicaciones.

Todo consumidor cumple estas condiciones:

1. Importa `goto` de `$app/navigation`.
2. Publica el estado con `goto("", { shallow: true, state })`.
3. No importa el modal; sólo publica el estado.
4. Usa la clave `show<Dominio><Accion>` y el valor `{ isOpen: true, data }` (o
   `{ isOpen: true }` si el modal no recibe datos).

### Disparador de creación (sin datos de contexto)

El botón de creación sólo publica `isOpen: true`, porque el formulario no
necesita datos previos. Puede vivir en el encabezado de la página o en la lista.

```svelte
<script lang="ts">
import { goto } from "$app/navigation";

import { Plus } from "@lucide/svelte";
</script>

<!-- Botón que abre el modal de creación -->
<button
	type="button"
	onclick={() =>
		goto("", {
			shallow: true,
			state: {
				showProductCreate: {
					isOpen: true,
				},
			},
		})}
>
	<Plus size={14} />
	<span>Crear Producto</span>
</button>
```

### Disparador con datos de la fila

Cuando el modal necesita datos del registro, se envían en `data`. Un disparador
que depende de `row` sólo puede vivir dentro de la lista o la tabla, porque el
dato nace en la fila.

```svelte
<button
	type="button"
	onclick={() =>
		goto("", {
			shallow: true,
			state: {
				showProductDelete: {
					isOpen: true,
					data: { productId: row.id, categoryId },
				},
			},
		})}
	aria-label="Eliminar producto"
	data-tooltip="Eliminar producto"
	data-tooltip-position="top-end"
>
	<Trash size={14} />
</button>
```

## 2. Montaje en `XModals.svelte`

El orquestador lee `page.state` y monta el casco con su formulario. No contiene
lógica de negocio.

```svelte
<script lang="ts">
import { page } from "$app/state";

import { Package, Trash } from "@lucide/svelte";

import FormModal from "#lib/components/ui/modals/FormModal.svelte";

import ProductCreateForm from "./ProductCreateForm.svelte";
import ProductDeleteForm from "./ProductDeleteForm.svelte";
</script>

<!-- Crear producto -->
{#if page.state.showProductCreate}
	<FormModal
		isOpen={page.state.showProductCreate.isOpen}
		onRequestClose={() => history.back()}
		width="medium"
		title="Crear Producto"
		subtitle="Completa los datos del nuevo registro"
		icon={Package}
	>
		<ProductCreateForm
			categoryId={page.state.showProductCreate.data.categoryId}
			onClose={() => history.back()}
		/>
	</FormModal>
{/if}

<!-- Eliminar producto existente -->
{#if page.state.showProductDelete}
	<FormModal
		isOpen={page.state.showProductDelete.isOpen}
		onRequestClose={() => history.back()}
		width="medium"
		title="Eliminar Producto"
		subtitle="Confirma la eliminación permanente del registro"
		icon={Trash}
	>
		<ProductDeleteForm
			categoryId={page.state.showProductDelete.data.categoryId}
			productId={page.state.showProductDelete.data.productId}
			onClose={() => history.back()}
		/>
	</FormModal>
{/if}
```

El orquestador se monta una sola vez en la página o en un orquestador padre:

```svelte
<script lang="ts">
import ProductModals from "./product/ProductModals.svelte";
</script>

<ProductModals />
```

## Reglas

1. Siempre usar `goto("", { shallow: true, state: {...} })`.
2. La clave es `show<Dominio><Accion>`.
3. El valor es `{ isOpen: true, data }`; si el modal no recibe datos, `{ isOpen: true }`.
4. La ubicación del disparador no está normada: lista, tabla, barra de acciones o encabezado.
5. El consumidor no importa el modal; sólo publica el estado.
6. Los botones de sólo icono llevan `aria-label` en español según [global.md](./global.md) §4.
7. Cerrar siempre con `history.back()`.
8. Para actualizar el mismo modal sin historial: `goto("", { shallow: true, replace: true })`.
9. No usar `replaceState(...)`.
10. `XModals.svelte` sólo hace `{#if}` + composición.
11. Cada modal recibe `isOpen` y sus datos desde `page.state.showX`.
12. El orquestador se renderiza una sola vez por dominio.
13. `+page.svelte` puede montar el orquestador, pero no debe duplicar la lógica
    de apertura que ya vive en los consumidores.

## Comentarios

En un componente se usan tres formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final** para handlers
  (`handleX`) y helpers.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).
- `<!-- -->` para etiquetar secciones de la plantilla.

No se usa `//` simple en el `<script>` ni `//` en la plantilla.

## Checklist de modal de dominio

- [ ] La apertura vive en el consumidor con `goto("", { shallow: true, state })`.
- [ ] La clave usa `show<Dominio><Accion>`.
- [ ] El valor es `{ isOpen: true }` o `{ isOpen: true, data }`.
- [ ] La ubicación del disparador es decisión de diseño, no la impone la regla.
- [ ] El consumidor no importa el modal; sólo publica el estado.
- [ ] `XModals.svelte` lee `page.state`.
- [ ] `onRequestClose` y `onClose` usan `history.back()`.
- [ ] El orquestador sólo compone cascos y componentes de dominio.
- [ ] Se monta una sola instancia de `XModals.svelte` por dominio.
