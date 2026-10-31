---

name: dominio-listar
description: Listar o consultar datos de un dominio. Úsalo cuando la petición sea crear una lista, una tabla, un detalle de lectura o una vista previa basada en query.
---

# Playbook: listar dominio

Este playbook cubre pantallas o componentes de lectura. Las convenciones viven
en:
[global.md](../../rules/global.md),
[validation.query.md](../../rules/validation.query.md),
[remote.query.md](../../rules/remote.query.md),
[component.query.md](../../rules/component.query.md),
[component.command.md](../../rules/component.command.md),
[modal.domain.md](../../rules/modal.domain.md).

## Archivos habituales

- `src/lib/validations/<dominio>/<dominio>.query.validation.ts`
- `src/lib/remote/<dominio>/<dominio>.query.remote.ts`
- `src/routes/(app)/<dominio>/XList.svelte`
- opcionalmente un componente de vista previa que consuma `query`

## Orden de trabajo

1. Definir `response` en `.query.validation.ts` y `params` sólo si la lectura
   recibe datos.
2. Implementar `.query.remote.ts` con validación de permisos y `return`
   validado en dos pasos.
3. Implementar `XList.svelte` con `<svelte:boundary>`.
4. Si la lista abre modales, publicar `page.state` desde el consumidor.

## Puntos de control

1. `query` es el sabor normal de lectura y usa `return`.
2. Todo `return` existe en `validation.response`.
3. `pending()` y `failed()` van dentro del boundary.
4. Si el `query` devuelve archivo, el sobre es
   `{ success, file, contentType }` con `file` como `ArrayBuffer`.

## Checklist de listado

- [ ] Existe `.query.validation.ts` con `response` (y `params` si recibe datos).
- [ ] Existe `.query.remote.ts` con `const xxx = v.parse(...); return xxx;`.
- [ ] `XList.svelte` usa `await <query>(...)` dentro de `<svelte:boundary>`.
- [ ] `pending` y `failed` están dentro del boundary.
- [ ] Si hay modales, la lista sólo publica `page.state`.
