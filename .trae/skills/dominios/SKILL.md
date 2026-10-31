---

name: dominios
description: Router para tareas de dominio. Úsalo cuando la petición sea crear, editar, eliminar, listar o revisar un dominio y necesites elegir el playbook correcto.
---

# Router: dominios

Este skill ya no concentra todo el playbook. Su trabajo es clasificar la
petición y abrir el skill específico que toca:

- Crear un dominio o un alta nueva →
  [dominio-crear](../dominio-crear/SKILL.md)
- Editar un dominio, un campo o una mutación existente →
  [dominio-editar](../dominio-editar/SKILL.md)
- Eliminar un registro, campo o flujo →
  [dominio-eliminar](../dominio-eliminar/SKILL.md)
- Listar, consultar o mostrar datos →
  [dominio-listar](../dominio-listar/SKILL.md)

## Reglas de enrutamiento

1. Si la petición combina más de una intención, aplicar más de un playbook en
   este orden: `listar` → `crear/editar/eliminar` → `modales`.
2. Si la petición toca un dominio completo desde cero, empezar por
   [dominio-crear](../dominio-crear/SKILL.md).
3. Si la petición sólo pide revisión, leer las capas involucradas y contrastar
   contra las reglas de `.trae/rules/`.
4. Las convenciones no viven aquí: leer siempre primero
   [global.md](../rules/global.md) y luego las reglas del rol tocado.

## Reglas a consultar

- [global.md](../rules/global.md)
- [validation.form.md](../rules/validation.form.md)
- [validation.command.md](../rules/validation.command.md)
- [validation.query.md](../rules/validation.query.md)
- [remote.form.md](../rules/remote.form.md)
- [remote.command.md](../rules/remote.command.md)
- [remote.query.md](../rules/remote.query.md)
- [component.form.md](../rules/component.form.md)
- [component.command.md](../rules/component.command.md)
- [component.query.md](../rules/component.query.md)
- [modal.base.md](../rules/modal.base.md)
- [modal.domain.md](../rules/modal.domain.md)
