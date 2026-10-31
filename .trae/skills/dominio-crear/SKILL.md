---

name: dominio-crear
description: Crear un dominio o un flujo de alta. Úsalo cuando la petición sea crear una entidad, agregar un formulario Create o montar un alta nueva en la aplicación.
---

# Playbook: crear dominio

Este playbook indica qué capas tocar cuando se crea un dominio nuevo o un flujo
de alta. Las convenciones viven en:
[global.md](../../rules/global.md),
[validation.form.md](../../rules/validation.form.md),
[validation.query.md](../../rules/validation.query.md),
[remote.form.md](../../rules/remote.form.md),
[remote.query.md](../../rules/remote.query.md),
[component.form.md](../../rules/component.form.md),
[component.query.md](../../rules/component.query.md),
[modal.base.md](../../rules/modal.base.md) y
[modal.domain.md](../../rules/modal.domain.md).

## Archivos habituales

Crear sólo los archivos que el flujo realmente necesite:

- `src/lib/validations/<dominio>/<dominio>.form.validation.ts`
- `src/lib/validations/<dominio>/<dominio>.query.validation.ts`
- `src/lib/remote/<dominio>/<dominio>.form.remote.ts`
- `src/lib/remote/<dominio>/<dominio>.query.remote.ts`
- `src/routes/(app)/<dominio>/XCreateForm.svelte`
- `src/routes/(app)/<dominio>/XList.svelte`
- `src/routes/(app)/<dominio>/XModals.svelte`

Si el dominio además nace con eliminación o descarga, ese trabajo lo cubren
otros playbooks.

## Orden de trabajo

1. Persistencia, sólo si cambia el modelo:
   `src/prisma/contract.ts` → `pnpm prisma contract emit` →
   `pnpm prisma db update` → `pnpm prisma db verify`.
2. Validación de alta:
   `.form.validation.ts` con `body` (sólo el login añade `response`).
3. Validación de lectura:
   `.query.validation.ts` con `response` y, si la lectura recibe datos,
   `params`.
4. Remote de alta:
   `.form.remote.ts` con `form(...)`, validación de permisos al inicio y refresh
   dirigido al `query`.
5. Remote de lectura:
   `.query.remote.ts` con `query(...)`, `v.parse(...)` y `return` en dos pasos.
6. `XCreateForm.svelte`:
   `preflight`, `enhance`, `if (ok) { ...; return; }` y `res.error` sin
   fallback local.
7. `XList.svelte`:
   `<svelte:boundary>` + `await <query>(...)` + estados `pending` y `failed`.
8. `XModals.svelte` y consumidor:
   apertura con `goto("", { shallow: true, state })` y cierre con
   `history.back()`.

## Checklist de creación

- [ ] Se crearon los schemas mínimos del flujo (`form` y `query`).
- [ ] El `form.remote.ts` refresca el `query` afectado.
- [ ] Los errores de negocio del `form` se devuelven como objeto literal.
- [ ] El `query.remote.ts` retorna con `const xxx = v.parse(...); return xxx;`.
- [ ] `XCreateForm.svelte` usa la sintaxis real del proyecto.
- [ ] `XList.svelte` monta el `query` dentro de `<svelte:boundary>`.
- [ ] `XModals.svelte` se monta una sola vez.
