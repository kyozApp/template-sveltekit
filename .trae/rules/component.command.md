---

alwaysApply: false
globs: src/**/*DeleteForm.svelte,src/**/*StatusToggle.svelte,src/**/*ExportButton.svelte
description: Reglas para componentes que ejecutan un remote command — DeleteForm, StatusToggle y ExportButton.
---

# Componentes COMMAND (`XDeleteForm.svelte` / `XStatusToggle.svelte` / `XExportButton.svelte`)

Rol único: ejecutar un remote `command` desde un handler del cliente. El
`command` se dispara por un evento, nunca por un `<form>`. Los ejemplos usan el
dominio ficticio `product`; sustitúyelo por el real.

## Cuándo aplica

Usa este archivo cuando la acción nace en un botón, switch o handler imperativo
del cliente y el remote asociado es de tipo `command`.

## Qué no va aquí

- Formularios con `preflight(...)` + `enhance(...)`: eso pertenece a
  `component.form.md`.
- Listas o vistas previas que sólo leen: eso pertenece a `component.query.md`.
- Orquestación de modales: eso pertenece a `modal.domain.md`.

Tres consumidores típicos comparten el mismo esqueleto:

- `XDeleteForm.svelte`: vive en un modal y cierra con `onClose()` al terminar.
- `XStatusToggle.svelte`: vive en una fila y sólo muestra un toast.
- `XExportButton.svelte`: vive en una barra de acciones y dispara una descarga
  (ver variante con payload más abajo).

## Estructura base

1. `interface Props` y `let { ... }: Props = $props();`.
2. Estado local `let isSubmitting = $state(false);`.
3. Handler `handleX` con JSDoc, guard de reentrada y `try/catch/finally`.

Todo componente COMMAND tiene guard de reentrada, `try/catch/finally` y estado
local `isSubmitting`.

```svelte
<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { deleteProduct } from "#lib/remote/product/product.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface Props {
	categoryId: string;
	productId: string;
	onClose: () => void;
}

let { categoryId, productId, onClose }: Props = $props();

let isSubmitting = $state(false);

/** Elimina el producto y su archivo del almacenamiento. */
const handleDelete = async () => {
	if (isSubmitting) return;
	isSubmitting = true;

	try {
		await deleteProduct({ categoryId, productId });
		notifications.showToastSuccess("¡Producto eliminado correctamente!");
		onClose();
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[PRODUCT DELETE][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos eliminar el producto en este momento. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[PRODUCT DELETE][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	} finally {
		isSubmitting = false;
	}
};
</script>
```

## Sintaxis

El disparador es un botón; nunca un `<form>`. El `disabled` sale de
`isSubmitting`.

```svelte
<!-- Botones de acción -->
<button type="button" onclick={onClose} disabled={isSubmitting}>
	<span>Cancelar</span>
</button>

<button type="button" onclick={handleDelete} disabled={isSubmitting}>
	{#if isSubmitting}
		<span>Eliminando...</span>
	{:else}
		<span>Eliminar Producto</span>
	{/if}
</button>
```

## Variante: `XStatusToggle.svelte`

Se usa cuando un listado necesita activar o desactivar registros: la
`XList.svelte` no ejecuta `command` (ver
[component.query.md](./component.query.md) §3), así que el toggle vive en su
propio componente, montado una vez por fila. La única diferencia con el esqueleto
es que el éxito no cierra nada.

```svelte
<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { toggleProductStatus } from "#lib/remote/product/product.command.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";

interface Props {
	productId: string;
	isActive: boolean;
}

let { productId, isActive }: Props = $props();

let isSubmitting = $state(false);

/** Alterna el estado activo o inactivo del producto. */
const handleToggle = async () => {
	if (isSubmitting) return;
	isSubmitting = true;

	try {
		await toggleProductStatus({ id: productId });
		notifications.showToastSuccess(
			`Producto ${isActive ? "desactivado" : "activado"} con éxito.`,
		);
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[PRODUCT TOGGLE STATUS][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos cambiar el estado del producto en este momento. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[PRODUCT TOGGLE STATUS][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	} finally {
		isSubmitting = false;
	}
};
</script>

<!-- Switch de estado -->
<button
	type="button"
	onclick={handleToggle}
	role="switch"
	aria-checked={isActive}
	aria-label="Alternar estado del producto"
	disabled={isSubmitting}
>
	<span class={isActive ? "translate-x-6" : "translate-x-0.5"}></span>
	<span class="sr-only">Estado: {isActive ? "Activo" : "Inactivo"}</span>
</button>
```

## Variante: `command` con payload (descarga)

Si el `command` retorna un payload, ese `return` es una excepción documentada con
`response` en [validation.command.md](./validation.command.md). El handler
consume el resultado validado, dispara la acción en el navegador y libera los
recursos que creó.

```svelte
/** Exporta el listado y dispara la descarga en el navegador. */ const
handleExport = async () =>
{if (isSubmitting) return;
	isSubmitting = true;

	try {
		// 1. Obtener el payload validado del command
		const result = await exportProductList({ categoryId });

		// 2. Convertir el contenido y disparar la descarga
		const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0));
		const url = URL.createObjectURL(new Blob([bytes]));
		const link = document.createElement("a");

		link.href = url;
		link.download = result.filename;
		link.click();

		// 3. Liberar la URL de objeto
		URL.revokeObjectURL(url);

		notifications.showToastSuccess("Listado exportado con éxito.");
	} catch (e) {
		if (isHttpError(e)) {
			console.error("[PRODUCT EXPORT][HTTP ERROR]", e);
			notifications.showToastError(
				"No pudimos exportar el listado en este momento. Por favor, comuníquese con sistemas.",
			);
		} else {
			console.error("[PRODUCT EXPORT][CONNECTION ERROR]", e);
			notifications.showToastError(
				"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
			);
		}
	} finally {
		isSubmitting = false;
	}};
```

## Reglas

1. Guard de reentrada: `if (isSubmitting) return;`.
2. La estructura es `try/catch/finally` y `finally { isSubmitting = false; }` es
   obligatorio.
3. El éxito es un toast. `XDeleteForm.svelte` además llama `onClose()`;
   `XStatusToggle.svelte` no cierra nada.
4. El `command` no retorna en el camino feliz; el refresco lo hace el remote
   (ver [remote.command.md](./remote.command.md)).
5. Si el componente necesita datos previos del registro, los lee con un `query`
   por composición, no dentro del mismo remote.
6. Una instancia por registro en el toggle: cada fila monta su propio estado y
   `isSubmitting` aísla la fila en curso.
7. La `XList.svelte` no importa ni ejecuta el `command`; sólo monta el toggle
   (ver [component.query.md](./component.query.md) §3).
8. El `disabled` sale de `isSubmitting`, no del `pending` del remote.
9. Accesibilidad del toggle: `role="switch"` + `aria-checked` + `aria-label` en
   español + texto `sr-only` con el estado.
10. El mensaje de éxito nombra la acción con el estado previo: si `isActive` era
    `true`, el registro quedó `desactivado`.
11. Si el `command` retorna payload, su `return` existe en `response` (ver
    [validation.command.md](./validation.command.md)) y el handler consume el
    resultado validado, no `page.state`.
12. `XDeleteForm.svelte` sigue siendo un componente COMMAND aunque viva dentro
    de un modal, porque su rol es ejecutar la mutación, no orquestar el modal.

## Comentarios

En un componente se usan tres formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final** para handlers
  (`handleX`) y helpers.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).
- `<!-- -->` para etiquetar secciones de la plantilla.

No se usa `//` simple en el `<script>` ni `//` en la plantilla.

## Checklist de COMMAND

- [ ] El archivo es `XDeleteForm.svelte`, `XStatusToggle.svelte` o
  `XExportButton.svelte`.
- [ ] Usa guard de reentrada.
- [ ] Usa `try/catch/finally`.
- [ ] Distingue error HTTP de error de conexión.
- [ ] El éxito es un toast; cierra el modal sólo si es `XDeleteForm.svelte`.
- [ ] El `disabled` sale de `isSubmitting`.
- [ ] El toggle usa `role="switch"` + `aria-checked` + `aria-label`.
- [ ] No llama `refreshAll()`.
- [ ] Su `XList.svelte` no importa el `command`; sólo monta el componente.
- [ ] Si el `command` retorna payload, su `return` existe en `response`.
