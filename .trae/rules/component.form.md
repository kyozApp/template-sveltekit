---

alwaysApply: false
globs: src/**/*CreateForm.svelte,src/**/*UpdateForm.svelte
description: Reglas para componentes de formulario Svelte 5 que consumen remotes form.
---

# Componentes FORM (`XCreateForm.svelte` / `XUpdateForm.svelte`)

Rol único: mutar datos con un remote `form`. `CreateForm` y `UpdateForm`
comparten la misma sintaxis. Los ejemplos usan `product`.

## Cuándo aplica

Usa este archivo cuando el usuario completa campos, envía un `<form>` y el
remote asociado es de tipo `form`.

## Qué no va aquí

- Botones imperativos como eliminar, toggle o exportar: eso pertenece a
  `component.command.md`.
- Listados, tablas y vistas previas: eso pertenece a `component.query.md`.
- Apertura y montaje de modales: eso pertenece a `modal.domain.md`.

## Estructura base

1. `interface Props` + `$props()`.
2. Instancia única: `const createForm = ...` o `const updateForm = ...`.
3. Campos desde `createForm.fields` o `updateForm.fields`.
4. Estado de envío con `$derived(<instancia>.pending > 0)`.

```svelte
<script lang="ts">
import { isHttpError } from "@sveltejs/kit";

import { nanoid } from "nanoid";

import { createProduct } from "#lib/remote/product/product.form.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";
import { productCreateSchema } from "#lib/validations/product/product.form.validation.ts";

interface Props {
	categoryId: string;
	onClose: () => void;
}

let { categoryId, onClose }: Props = $props();

const createForm = createProduct.for(nanoid());
const { categoryId: fieldCategoryId, name: fieldName } = createForm.fields;

const submitting = $derived(createForm.pending > 0);
</script>
```

## Sintaxis

```svelte
<form
	class="flex flex-col gap-5"
	{...createForm.preflight(productCreateSchema.body)}
	{...createForm.enhance(async (f) => {
		try {
			const ok = await f.submit();

			if (ok) {
				const res = f.result;
				if (res && !res.success) {
					notifications.showToastError(res.error);
					return;
				}

				notifications.showToastSuccess("¡Producto registrado correctamente!");
				onClose();
				return;
			}

			console.error("[PRODUCT CREATE][PROCESSING ERROR]", { ok });
			notifications.showToastError(
				"Ocurrió un problema inesperado al registrar el producto. Por favor, comuníquese con sistemas.",
			);
		} catch (e) {
			if (isHttpError(e)) {
				console.error("[PRODUCT CREATE][HTTP ERROR]", e);
				notifications.showToastError(
					"No pudimos registrar el producto en este momento. Por favor, comuníquese con sistemas.",
				);
			} else {
				console.error("[PRODUCT CREATE][CONNECTION ERROR]", e);
				notifications.showToastError(
					"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
				);
			}
		}
	})}
	oninput={() => createForm.validate()}
	novalidate
>
	<input {...fieldCategoryId.as("hidden", categoryId)}>
	<input {...fieldName.as("text")}>
</form>
```

## Reglas

1. `preflight(<schema>.body)` valida en cliente.
2. `enhance(...)` resuelve el submit con `await f.submit()`.
3. El camino feliz usa `if (ok) { ...; return; }`.
4. `ok === true` lee `f.result`; si hay error de negocio se usa
   `notifications.showToastError(res.error);` sin fallback local.
   `ok === false` registra `[PROCESSING ERROR]`.
5. En `catch`, `isHttpError(e)` separa `[HTTP ERROR]` de
   `[CONNECTION ERROR]`.
6. El `form` no retorna el dato en el camino feliz; el refresco lo hace el
   propio remote (ver [remote.form.md](./remote.form.md)). El mensaje de negocio
   también lo entrega el remote en `res.error`.
   Excepción: el formulario de **auto-actualización del perfil** propio llama
   `await refreshAll()` tras el éxito, porque el cambio del usuario en sesión
   debe propagarse a todo el sistema (layout incluido).
7. `oninput={() => <instancia>.validate()}` y `novalidate` son obligatorios.
8. Mantener el nombre concreto de la instancia (`createForm` / `updateForm`)
   para que el archivo refleje su acción.

## Tipos de campo

El control se declara en `field.as("<tipo>", <valorInicial>)`.

### String

```svelte
<input {...fieldName.as("text")} id="product-create-name" placeholder="Nombre">
```

### Selector

Sin flecha nativa; usa `ChevronDown` propia.

```svelte
<div class="relative flex w-full items-center">
	<select
		{...fieldRole.as("select", "")}
		class={[
			"peer min-h-12 w-full cursor-pointer appearance-none rounded-xl bg-white bg-none pr-10 pl-11",
			fieldRole.issues()?.length && "border-red-500 dark:border-red-400",
		]}
		onchange={(e) => e.currentTarget.blur()}
		disabled={submitting}
	>
		<option value="" disabled selected>Selecciona un rol</option>
		<option value="ADMIN">Administrador</option>
	</select>
	<span
		class="pointer-events-none absolute right-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-transform duration-200 peer-focus:rotate-180 dark:text-zinc-400"
	>
		<ChevronDown size={16} />
	</span>
</div>
```

### Booleano

Se usa como switch, no como checkbox crudo.

```svelte
{@const isActiveChecked = fieldIsActive.value() ?? false}

<label class="relative inline-flex h-6 w-11 cursor-pointer items-center">
	<input {...fieldIsActive.as("checkbox", false)} class="sr-only">
	<span class={isActiveChecked ? "translate-x-5" : "translate-x-0"}></span>
</label>
```

### Clave

Tipo dinámico controlado por `$state`.

```svelte
<input {...fieldPassword.as(showPassword ? "text" : "password")}>
```

### Fecha

Las fechas se capturan como texto libre con validación `v.string()`. No
introducir `type="date"` ni `type="datetime-local"` sin unificar antes el schema
y el formato.

## Comentarios

En un componente se usan tres formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final** para handlers
  (`handleX`) y helpers.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).
- `<!-- -->` para etiquetar secciones de la plantilla.

No se usa `//` simple en el `<script>` ni `//` en la plantilla.

## Checklist de FORM

- [ ] El archivo es `XCreateForm.svelte` o `XUpdateForm.svelte`.
- [ ] Usa `preflight` + `enhance`.
- [ ] El éxito sigue `if (ok) { ...; return; }`.
- [ ] Lee `f.result` y distingue `PROCESSING`, `HTTP` y `CONNECTION`.
- [ ] Usa `novalidate` + `oninput={() => form.validate()}`.
- [ ] No llama `refreshAll()` (salvo el formulario de perfil propio).
