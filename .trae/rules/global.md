---

alwaysApply: true
description: Reglas globales para proyectos SvelteKit (stack, principio un rol por archivo, sintaxis de comentarios, botones y tooltips, estilo y markdownlint). Punto de entrada a las reglas por capa.
---

# Reglas globales

Stack base: SvelteKit 3 (remote functions experimentales) + Valibot + Prisma (ORM
postgres) + Tailwind 4 + Biome.

## Por dónde empezar

Este es el archivo troncal (`alwaysApply`): se carga siempre. Cada capa tiene su
propio archivo de reglas, autónomo, y cuando la capa tiene más de un sabor se
divide por rol:

- Validación → [validation.form.md](./validation.form.md),
  [validation.command.md](./validation.command.md),
  [validation.query.md](./validation.query.md)
- Remote (server) → [remote.form.md](./remote.form.md),
  [remote.command.md](./remote.command.md),
  [remote.query.md](./remote.query.md)
- Componentes → [component.form.md](./component.form.md),
  [component.command.md](./component.command.md),
  [component.query.md](./component.query.md)
- Modales → [modal.base.md](./modal.base.md),
  [modal.domain.md](./modal.domain.md)

Orden recomendado al **crear o actualizar** un dominio (de abajo hacia arriba):

1. Validación (schema).
2. Remote (handler).
3. Componentes (`List` / `Preview` / `CreateForm` / `UpdateForm` /
   `DeleteForm` / `StatusToggle`).
4. Modales (`XModals` + montaje).

Para saber **qué capas tocar** según la petición, ver
[dominio-crear](../skills/dominio-crear/SKILL.md),
[dominio-editar](../skills/dominio-editar/SKILL.md),
[dominio-eliminar](../skills/dominio-eliminar/SKILL.md),
[dominio-listar](../skills/dominio-listar/SKILL.md) o el
[router de dominios](../skills/dominios/SKILL.md).

---

## Recomendación de redacción

Cada archivo de `.trae/rules/` debe seguir estas pautas para mantenerse útil,
preciso y fácil de cargar en el editor:

1. Un archivo documenta **un solo rol**.
2. Cada archivo es **autónomo**: explica su sintaxis, límites, comentarios y
   checklist sin depender de leer otro primero.
3. Los ejemplos son **cortos pero reales**: muestran la forma exacta que se
   espera en el código del proyecto.
4. El archivo debe mantenerse **preferentemente por debajo de 10000
   caracteres**.
5. No se documenta como regla manual lo que ya resuelve la herramienta del
   proyecto, por ejemplo el orden de imports aplicado por Biome.

---

## 1. Principio rector: un archivo cumple un solo rol

Cada archivo tiene **una única responsabilidad**. No se mezclan sabores de remote
functions ni capas (validación / server / UI) en el mismo archivo.

| Capa                  | Carpeta canónica                                                | Sufijo por rol                                                                        |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Validación            | `src/lib/validations/<dominio>/`                                | `.form.validation.ts`, `.command.validation.ts`, `.query.validation.ts`               |
| Remote (server)       | `src/lib/remote/<dominio>/`                                     | `.form.remote.ts`, `.command.remote.ts`, `.query.remote.ts`                           |
| Componente de dominio | `src/lib/components/<dominio>/` o `src/routes/(app)/<dominio>/` | `List`, `Preview`, `CreateForm`, `UpdateForm`, `DeleteForm`, `StatusToggle`, `Modals` |

El "dominio" es una entidad del negocio y usa **kebab-case**: agrupa todo lo de
esa entidad bajo una misma carpeta, por ejemplo `product/`, `customer/` o
`system-setting/`.

---

## 2. Sintaxis de comentarios (única para todo el proyecto)

El tipo de comentario se elige por **su función**, no por el archivo. Un solo
estándar, igual en `.ts` y en `.svelte`. Todos los comentarios van en **español**.

| Función del comentario                                                             | Sintaxis                        | Ejemplo                                 |
| ---------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------- |
| Describir una declaración (función, schema, tipo, export) o una decisión de diseño | JSDoc `/** ... */`              | `/** Obtiene la lista de productos. */` |
| Explicar pasos secuenciales dentro de una función (el orden importa)               | `// N.` (`// 1.`, `// 2.`, ...) | `// 1. Validar permisos`                |
| Etiquetar una sección de la plantilla                                              | `<!-- ... -->`                  | `<!-- Zona de carga de archivo -->`     |

El verbo y el punto final del JSDoc son propios de cada capa y los define el
archivo de reglas de su rol (`validation.*.md`, `remote.*.md`,
`component.*.md`).

Reglas:

1. Qué declaraciones llevan JSDoc depende de la capa: cada archivo de rol define
   lo suyo.
2. Toda descripción (de una o varias líneas) va en JSDoc; el `//` simple no se
   usa.
3. `// N.` se usa **solo dentro de funciones** cuando hay varios pasos y el orden
   es relevante. No se usa para describir declaraciones.
4. En la plantilla `.svelte` **nunca** se usa `//` (es inválido); se usa `<!-- -->`.
5. En `.md`, los separadores usan `---`.

---

## 3. Formato y estilo (Biome)

Todo el formato y el orden de imports los aplica Biome (`pnpm fix`): indentación
con **tabs** (`indentWidth: 2`), comillas **dobles**, punto y coma obligatorio y
clases Tailwind ordenadas (`useSortedClasses`). No se declaran como reglas
manuales.

- Comando de verificación/corrección: `pnpm fix` (check + write), `pnpm check`,
  `pnpm build`.
- **Prohibido** colores hex en clases/estilos (`noHexColors: error`); usar tokens
  de Tailwind (`zinc-*`, `red-*`, `dark:`).
- Markdown: **todo `.md`** (incluidos los de `.trae/`) debe revisarse con
  markdownlint antes de cerrar la tarea:
  `pnpm dlx markdownlint-cli2 "**/*.md"`. La configuración vive en
  `.markdownlint.json`. **MD013** limita a **100 caracteres** por línea (excluye
  tablas, bloques de código y encabezados). **MD010** permite tabs dentro de
  bloques de código (`code_blocks: false`), fiel al estilo del proyecto.

---

## 4. Botones y tooltips

El nombre accesible y el tooltip son cosas distintas: el nombre lo lee el lector
de pantalla; el tooltip es ayuda visual para quien ve el icono.

- **Sólo icono** → `aria-label` (o texto `sr-only`) obligatorio. El tooltip es
  opcional y, si se usa, es `data-tooltip` con `data-tooltip-position`.
- **Icono + texto** → el texto visible es el nombre; sin `aria-label` y sin
  tooltip.
- **Sólo texto** → el texto visible es el nombre; sin tooltip.
- El tooltip sólo se usa cuando aporta información que no está a la vista
  (por ejemplo un atajo de teclado); nunca repite el texto del botón.
- Ningún botón usa `title`: duplica el tooltip del kit, no respeta dark mode y
  no aparece con foco de teclado.

`data-tooltip` es el primitivo del kit de este repo. Si un proyecto no lo tiene,
el botón de sólo icono queda con `aria-label` y sin `title`.

---

## 5. Rutas: privadas y públicas

La protección vive en los archivos de ruta, no en los componentes del dominio:

- **Pública** (`(public)/`): el `+layout.server.ts` no bloquea; expone
  `{ user: locals.user ?? null }`. Si la página no debe verse con sesión abierta
  (por ejemplo el inicio de sesión), el `+page.server.ts` desvía al usuario.
- **Privada** (`(app)/`): el `+layout.server.ts` exige sesión y entrega `user`.
- **Privada con permiso**: un `+layout.server.ts` anidado lee el usuario del
  layout padre y exige el permiso con `hasPermission`.

### Guard de sesión (grupo privado)

```ts
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	// 1. Exigir sesión; sin usuario se desvía al inicio de sesión
	if (!locals.user) {
		redirect(302, "/iniciar-sesion");
	}

	// 2. Exponer el usuario al resto del grupo
	return { user: locals.user };
};
```

### Guard por permiso (ruta sensible)

```ts
import { redirect } from "@sveltejs/kit";

import { hasPermission } from "#lib/constants.ts";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent }) => {
	// 1. Obtener el usuario autenticado desde el layout parent
	const { user } = await parent();

	// 2. Bloquear el acceso sin el permiso correspondiente
	if (!hasPermission(user.role, "product:view")) {
		redirect(302, "/dashboard");
	}
};
```

### Página pública cerrada a sesión (opcional)

```ts
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, "/dashboard");
	}
};
```

Reglas:

1. La autorización de ruta se hace con `hasPermission` dentro de un
   `+layout.server.ts`; nunca con comparaciones de rol.
2. El guard por permiso parte de `parent()` para heredar el `user` del grupo
   privado; no lo reemplaza.
3. El destino de la redirección por falta de permiso es `/dashboard`.
4. El guard es la barrera real de la ruta; ocultar elementos en la UI es un
   complemento, nunca la protección.

---

## 6. Checklist de cierre (global)

Aplica a **todo** cambio, antes de darlo por terminado:

- [ ] Un archivo = un rol (no se mezclan sabores de remote ni capas).
- [ ] Cada regla sigue enfocada y preferentemente queda bajo 10000 caracteres.
- [ ] Se respetó la sintaxis de comentarios (§2) y la capa definió su verbo.
- [ ] Los botones de sólo icono siguen §4 (sin `title`).
- [ ] Toda ruta privada o sensible tiene su guard en `+layout.server.ts` (§5).
- [ ] `pnpm fix` sin cambios pendientes.
- [ ] `pnpm check` sin errores.
- [ ] `pnpm build` correcto.
- [ ] Si se tocó algún `.md`:
  `pnpm dlx markdownlint-cli2 "**/*.md"` sin errores.
- [ ] Se revisó el checklist del archivo de rol correspondiente:
  [validation.form.md](./validation.form.md),
  [validation.command.md](./validation.command.md),
  [validation.query.md](./validation.query.md),
  [remote.form.md](./remote.form.md),
  [remote.command.md](./remote.command.md),
  [remote.query.md](./remote.query.md),
  [component.form.md](./component.form.md),
  [component.command.md](./component.command.md),
  [component.query.md](./component.query.md),
  [modal.base.md](./modal.base.md),
  [modal.domain.md](./modal.domain.md).
