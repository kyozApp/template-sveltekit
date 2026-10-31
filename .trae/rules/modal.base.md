---

alwaysApply: false
globs: src/lib/components/ui/modals/**/*.svelte
description: Reglas para el kit base de modales en ui/modals — Modal.svelte, cascos reutilizables y creación de modales personalizados.
---

# Modales base (`ui/modals/**`)

Rol único: definir el kit compartido de modales. Aquí viven `Modal.svelte` y
los cascos genéricos reutilizables (`FormModal`, `TableModal`, `PdfModal`). Un
dominio puede añadir sus propios cascos de cabecera simple o a medida siguiendo
el patrón de §3. No contienen lógica de dominio.

Los ejemplos usan un dominio ficticio `product`; sustitúyelo por el real.

## Cuándo aplica

Usa este archivo cuando el cambio toca el kit transversal de `ui/modals/` o se
crea un casco reutilizable nuevo.

## Qué no va aquí

- `page.state`, `goto(...)` o `history.back()`: eso pertenece a
  `modal.domain.md`.
- Formularios, queries o commands de un dominio: eso pertenece a su capa.
- Condiciones `{#if}` para decidir qué modal se monta: eso pertenece al
  orquestador del dominio.

## 1. Kit base `ui/modals/`

`Modal.svelte` es la base sobre el `<dialog>` nativo y siempre existe dentro del
kit de `components/ui`. Los demás archivos son cascos que lo envuelven para
aportar cabecera y área de contenido.

| Archivo             | Uso                          | Cabecera                                    | Cuerpo                  |
| ------------------- | ---------------------------- | ------------------------------------------- | ----------------------- |
| `Modal.svelte`      | Base (`<dialog>`)            | — (solo `children`)                         | `{@render children()}`  |
| `FormModal.svelte`  | Formularios y confirmaciones | icono + `title` + `subtitle` + botón cerrar | `children`              |
| `TableModal.svelte` | Tablas y listados            | icono + `title` + `subtitle` + botón cerrar | `children` con scroll   |
| `PdfModal.svelte`   | Vista previa de documento    | icono + `title` + `subtitle` + botón cerrar | `children` en área fija |

Contrato de props de los cascos estándar: `isOpen`, `onRequestClose`, `width`,
`title`, `subtitle`, `icon`, `children`. Un casco de cabecera simple omite
`icon`; uno de cabecera a medida recibe un snippet (`header`) en lugar de
`title`/`subtitle`/`icon`.

## 2. Base `Modal.svelte`

Props declarativas, sin estado duplicado de apertura.

```svelte
<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	isOpen: boolean;
	onRequestClose?: () => void;
	width?: "small" | "medium" | "large" | string;
	children: Snippet;
}

let { isOpen, onRequestClose, width = "medium", children }: Props = $props();

let dialogEl = $state<HTMLDialogElement | null>(null);

const widthClass = $derived(
	width === "small"
		? "max-w-xl"
		: width === "medium"
			? "max-w-2xl"
			: width === "large"
				? "max-w-7xl"
				: width,
);

/** Intercepta el ESC nativo del dialog y delega el cierre al controlador del padre. */
const handleCancel = (e: Event) => {
	if (e.target !== dialogEl) return;

	e.preventDefault();
	onRequestClose?.();
};

/** Sincroniza el `<dialog>` con el prop `isOpen`. */
$effect(() => {
	if (!dialogEl) return;

	if (isOpen && !dialogEl.open) {
		dialogEl.showModal();
	} else if (!isOpen && dialogEl.open) {
		dialogEl.close();
	}
});
</script>

<dialog
	bind:this={dialogEl}
	oncancel={handleCancel}
	aria-modal="true"
	class={[
		"m-auto max-h-[90dvh] w-11/12 overflow-hidden overscroll-contain rounded-2xl border border-zinc-200 bg-white p-0 shadow-2xl transition-all duration-300 outline-none backdrop:bg-zinc-950/60 backdrop:backdrop-blur-xs open:flex open:flex-col dark:border-zinc-800 dark:bg-zinc-900",
		widthClass,
	]}
>
	{@render children()}
</dialog>
```

## 3. Crear un modal personalizado

Cuando un dominio necesita otra cabecera o distribución, se crea un casco nuevo
en `src/lib/components/ui/modals/` que envuelve `Modal`.

1. Reutilizar primero `FormModal`, `TableModal` o `PdfModal` si encaja.
2. Importar `Modal.svelte` como base.
3. Declarar `Props` con el contrato común (`isOpen`, `onRequestClose`, `width`)
   más lo propio de la cabecera.
4. Renderizar `<Modal {isOpen} {onRequestClose} {width}>` y pasar el contenido
   por `children`.
5. No importar remotes, validaciones ni `page.state`.

```svelte
<script lang="ts">
import type { Snippet } from "svelte";

import { X } from "@lucide/svelte";

import Modal from "#lib/components/ui/modals/Modal.svelte";

interface Props {
	isOpen: boolean;
	onRequestClose: () => void;
	width?: "small" | "medium" | "large" | string;
	title: string;
	children: Snippet;
}

let { isOpen, onRequestClose, width = "medium", title, children }: Props =
	$props();
</script>

<Modal {isOpen} {onRequestClose} {width}>
	<div
		class="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900"
	>
		<!-- Cabecera personalizada -->
		<div
			class="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"
		>
			<h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
				{title}
			</h2>
			<button
				type="button"
				onclick={() => onRequestClose()}
				aria-label="Cerrar modal"
				class="flex size-9 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
			>
				<X size={18} />
			</button>
		</div>

		<!-- Contenido aportado por el padre -->
		<div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
			{@render children()}
		</div>
	</div>
</Modal>
```

## Reglas

1. `Modal.svelte` es el único archivo que manipula el `<dialog>`.
2. `isOpen` es requerido y el padre siempre lo controla.
3. `onRequestClose` delega el cierre al flujo del padre.
4. Los cascos sólo aportan layout, cabecera y scroll.
5. `title`, `subtitle` y `aria-label` van en español.
6. Los cascos no importan remotes, validaciones ni estado de página.
7. Si un modal nuevo sólo sirve a un dominio, aun así el casco vive aquí sólo
   si es reutilizable; si no lo es, se resuelve en la composición del dominio.

## Comentarios

En un componente se usan tres formas:

- JSDoc `/** ... */` en **tercera persona** y **con punto final** para handlers
  (`handleX`) y helpers.
- `// N.` para cada paso secuencial del handler (`// 1.`, `// 2.`, ...).
- `<!-- -->` para etiquetar secciones de la plantilla.

No se usa `//` simple en el `<script>` ni `//` en la plantilla.

## Checklist de modal base

- [ ] El archivo vive en `src/lib/components/ui/modals/`.
- [ ] El casco envuelve `Modal` y no manipula el `<dialog>`.
- [ ] Usa `isOpen`, `onRequestClose` y `width`.
- [ ] El contenido entra por `children`.
- [ ] No contiene lógica de dominio.
