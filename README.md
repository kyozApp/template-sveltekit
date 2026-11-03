# ⚡ Template SvelteKit

Plantilla base de desarrollo rápido para aplicaciones web Fullstack modernas,
construida sobre **SvelteKit**, **Prisma 8**, **PostgreSQL 18**,
**Tailwind CSS**, **Paraglide JS (i18n)**, **Valibot**, **Argon2** y **Biome**.

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
2. En **`.env.example`**, actualiza el nombre de la base de datos `template_sveltekit_db`
   con el nombre de tu base de datos en PostgreSQL.
3. En **`compose.yaml`**, actualiza el nombre del proyecto `name: template_sveltekit_prod`
   y el nombre del contenedor `container_name: template_sveltekit_prod_db`.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).
