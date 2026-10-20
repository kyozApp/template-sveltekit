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

1. En **`package.json`**, actualiza el campo `"name"` con el nombre de tu proyecto.
2. En tu editor, presiona `Ctrl + Shift + F` (búsqueda global) y reemplaza estos valores:
   - **`mi-app`**: Nombre de la carpeta de tu proyecto.
   - **`template_sveltekit_db`**: Nombre de tu base de datos en PostgreSQL.
   - **`template_sveltekit_prod`**: Nombre del proyecto en Podman Compose (`compose.yaml`).
   - **`template_sveltekit_prod_db`**: Nombre del contenedor de base de datos en producción.

### 3. Continuar en desarrollo local

Abre la **[Guía de Desarrollo Local](docs/dev.md)** para preparar tu entorno en desarrollo.

---

## 📚 Documentación

- 📘 **[Desarrollo (dev.md)](docs/dev.md)**: Primera vez y flujo diario en local.
- ⚙️ **[Producción (prod.md)](docs/prod.md)**: Despliegue inicial, actualizaciones y monitoreo.
- 🗄️ **[Base de Datos (database.md)](docs/database.md)**: Consola, respaldos, migración MySQL y
  mantenimiento de Enums.
- 🛠️ **[Scripts (scripts/README.md)](scripts/README.md)**: Scripts puntuales de mantenimiento y
  migración de datos.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).
