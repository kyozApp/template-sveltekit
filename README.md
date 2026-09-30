# ⚡ Template SvelteKit

Plantilla base de desarrollo rápido para aplicaciones web Fullstack modernas, construida sobre
**SvelteKit**, **Svelte 5 (Runes)**, **Prisma 8 (Contract Builder)**, **PostgreSQL 18**,
**Tailwind CSS v4**, **Inter Variable**, **Paraglide JS (i18n)**, **Subpath Imports (`#lib`)**,
**Valibot**, **Argon2** y **Biome**.

---

## 🚀 Cómo Usar Esta Plantilla

### 1. Clonar el proyecto con degit

Ejecuta el siguiente comando para descargar una copia limpia sin historial git:

```bash
pnpm dlx degit kyozApp/template-sveltekit mi-app
cd mi-app
```

### 2. Personalizar la plantilla

Edita los siguientes archivos para adaptar la plantilla al nombre de tu proyecto:

- **`package.json`**: actualiza `"name"` (`mi-app`).
- **`.env.example`**: configura `PORT`, `ORIGIN`, `BODY_SIZE_LIMIT` y `DATABASE_URL`.
- **`docs/dev.md`**: actualiza la ruta del proyecto (`cd ~/proyectos/mi-app`).
- **`docs/prod.md`**:
  - Con el buscador (`Ctrl + F`) reemplaza en este archivo:
    - `mi-app` por el nombre de tu proyecto.
  - Actualiza el campo `Description` de cada servicio en Systemd:
    - En `mi-app.service`: descripción de tu aplicación web (`Mi Aplicación SvelteKit`).
    - En `mi-app-worker.service`: descripción del worker (`Mi Aplicación Worker`).

### 3. Continuar en desarrollo local

Una vez renombrado el proyecto, abre la **[Guía de Desarrollo Local (docs/dev.md)](docs/dev.md)**
para instalar dependencias, inicializar Prisma 8 y arrancar la aplicación web junto a su worker.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).
