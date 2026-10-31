---

name: dominio-eliminar
description: Eliminar un flujo o registro de dominio. Úsalo cuando la petición sea borrar una entidad, crear un DeleteForm o ajustar una acción command de eliminación.
---

# Playbook: eliminar dominio

Este playbook cubre la eliminación de registros o flujos. Las convenciones
viven en:
[global.md](../../rules/global.md),
[validation.command.md](../../rules/validation.command.md),
[remote.command.md](../../rules/remote.command.md),
[component.command.md](../../rules/component.command.md),
[modal.domain.md](../../rules/modal.domain.md).

## Archivos habituales

- `src/lib/validations/<dominio>/<dominio>.command.validation.ts`
- `src/lib/remote/<dominio>/<dominio>.command.remote.ts`
- `src/routes/(app)/<dominio>/XDeleteForm.svelte`
- `src/routes/(app)/<dominio>/XModals.svelte`
- consumidor que abre el modal desde la lista

## Orden de trabajo

1. Definir el `body` del `command` en validation.
2. Si el `command` tendrá excepción con `return`, definir también `response`.
3. Implementar el `.command.remote.ts`:
   validación de permisos, validación de existencia, mutación y refresh
   dirigido.
4. Implementar `XDeleteForm.svelte` con guard de reentrada y
   `try/catch/finally`.
5. Montar el modal de confirmación en `XModals.svelte`.
6. Publicar la apertura desde el botón consumidor con `goto`.

## Puntos de control

1. El flujo normal del `command` no retorna.
2. Si hay excepción con `return`, usa
   `const xxx = v.parse(schema.response, payload); return xxx;`.
3. `XDeleteForm.svelte` no llama `refreshAll()`.
4. El cierre del modal usa `history.back()`.

## Checklist de eliminación

- [ ] Existe `.command.validation.ts`.
- [ ] Existe `.command.remote.ts`.
- [ ] `XDeleteForm.svelte` usa guard + `try/catch/finally`.
- [ ] El remote refresca sólo lo afectado.
- [ ] El modal se abre desde el consumidor y se monta en `XModals.svelte`.
