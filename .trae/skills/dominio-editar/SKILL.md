---

name: dominio-editar
description: Editar un dominio existente. Úsalo cuando la petición sea cambiar campos, ajustar formularios Update, modificar remotes o actualizar una vista de edición.
---

# Playbook: editar dominio

Este playbook cubre cambios sobre un dominio ya existente. Las convenciones
viven en:
[global.md](../../rules/global.md),
[validation.form.md](../../rules/validation.form.md),
[validation.query.md](../../rules/validation.query.md),
[remote.form.md](../../rules/remote.form.md),
[remote.query.md](../../rules/remote.query.md),
[component.form.md](../../rules/component.form.md),
[component.query.md](../../rules/component.query.md),
[modal.domain.md](../../rules/modal.domain.md).

## Qué tocar según el cambio

- Si cambia un campo editable:
  `.form.validation.ts` → `.form.remote.ts` → `XUpdateForm.svelte`.
- Si cambia un dato visible en lista o detalle:
  `.query.validation.ts` → `.query.remote.ts` → `XList.svelte`.
- Si cambia una edición con modal:
  además `XModals.svelte` y el botón consumidor que publica `page.state`.
- Si cambia el contrato de un `return` en `query` o en una excepción de
  `command`: actualizar también `response` en validation.

## Orden recomendado

1. Ajustar persistencia si el modelo cambió.
2. Actualizar primero validation.
3. Actualizar luego el remote del mismo sabor.
4. Después actualizar el componente consumidor.
5. Si el flujo usa modal, revisar apertura y montaje.

## Puntos de control

1. `query` sigue usando `const xxx = v.parse(...); return xxx;`.
2. `form` sólo retorna en excepción y devuelve el objeto literal directo, sin
   `v.parse`.
3. `XUpdateForm.svelte` conserva `if (ok) { ...; return; }`.
4. La UI consume `res.error` directamente.
5. El refresco sigue siendo dirigido desde el remote.

## Checklist de edición

- [ ] Validation y remote quedaron alineados.
- [ ] No se mezclaron sabores en un mismo archivo.
- [ ] La UI refleja el contrato real del remote.
- [ ] Si hubo modal, el estado sigue en `page.state`.
- [ ] Se revisaron sólo las capas afectadas por el cambio.
