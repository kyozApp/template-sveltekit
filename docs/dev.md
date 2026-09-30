# 🛠️ Desarrollo Local

Guía operativa para preparar el entorno local, inicializar la base de datos y arrancar la aplicación.

---

## 🛠️ Herramientas de Desarrollo (Snippets)

Instala la extensión oficial **[Kyoz Snippets](https://github.com/kyozApp/kyoz-snippets)**
para el editor Zed (snippets de Valibot, Tailwind y Svelte):

### 1. Clona el repositorio

```bash
cd ~/proyectos
git clone https://github.com/kyozApp/kyoz-snippets.git
```

### 2. Instalar en Zed

En Zed, presiona `F1`, escribe **`install dev extension`** y selecciona la carpeta clonada.

---

## ✅ Requisitos Previos

- **Node.js**: `24.21.0`
- **pnpm**: `12.3.4`
- **PostgreSQL 18** accesible en el puerto `5432` (stack central de `~/proyectos/services`).

---

## 🚀 Puesta en Marcha Inicial

### 1. Crear archivo de entorno local

```bash
cd ~/proyectos/mi-app
cp .env.example .env
```

### 2. Instalar dependencias

```bash
pnpm i
```

### 3. Emitir contrato de Prisma 8, inicializar base y crear superadmin

```bash
pnpm prisma contract emit
pnpm prisma db init
pnpm prisma db verify
pnpm seed
```

### 4. Iniciar la aplicación web

```bash
pnpm dev
```

### 5. Iniciar el worker

```bash
pnpm worker:dev
```

---

## 🔄 Flujo Diario (Cambios en el Esquema)

Cuando agregues o modifiques modelos en `src/prisma/contract.ts`:

```bash
pnpm prisma contract emit
pnpm prisma db update
pnpm prisma db verify
pnpm dev
```

### ⚠️ Modificación de Enums Nativos (`MIGRATION.PLANNING_FAILED`)

PostgreSQL no permite eliminar, renombrar ni reordenar valores de un `ENUM` nativo de forma
automática (solo permite añadir al final con `ADD VALUE`). Si eliminas o renombras opciones de un
enum en `contract.ts`, `pnpm prisma db update` fallará con un error de planificación.

#### Procedimiento para solucionarlo

##### 1. Ejecutar el script SQL en la base de datos (vía DBeaver, TablePlus o `psql`)

_(Ejemplo migrando los roles por defecto de la plantilla a roles personalizados):_

```sql
-- 1. Crear el nuevo enum con los valores que declaraste en contract.ts
CREATE TYPE "Role_new" AS ENUM (
  'SUPERADMIN',
  'IT_MANAGER',
  'IT_SUPPORT',
  'SALES',
  'VIEWER'
);

-- 2. Quitar temporalmente el valor default de la columna
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- 3. Mapear los valores viejos a los nuevos sin perder datos
ALTER TABLE "User"
  ALTER COLUMN "role" TYPE "Role_new"
    USING (
      CASE "role"::text
        WHEN 'ADMIN' THEN 'IT_MANAGER'::"Role_new"
        WHEN 'USER'  THEN 'SALES'::"Role_new"
        ELSE "role"::text::"Role_new"
      END
    );

-- 4. Reasignar el valor por defecto declarado en tu contrato
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'SALES'::"Role_new";

-- 5. Eliminar el enum viejo y renombrar el nuevo
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";
```

##### 2. Re-emitir el contrato y sincronizar con Prisma

```bash
pnpm prisma contract emit
pnpm prisma db update
pnpm prisma db verify
```

---

## 🏷️ Convenciones de Nomenclatura (Entidades Multipalabra)

Cuando una entidad o módulo del dominio esté compuesto por **dos o más palabras** (por ejemplo,
`consumable-product` / productos consumibles), aplica la siguiente simetría de nomenclatura:

| Capa / Elemento               | Convención de Formato | 1 Palabra (`user`)            | 2 o más Palabras (`consumable-product`)                 |
| :---------------------------- | :-------------------- | :---------------------------- | :------------------------------------------------------ |
| **Directorio de negocio**     | `kebab-case/`         | `user/`                       | `consumable-product/`                                   |
| **Validaciones Valibot**      | `kebab-case.tipo.ts`  | `user.form.validation.ts`     | `consumable-product.form.validation.ts`                 |
| **Remote Functions (Server)** | `kebab-case.tipo.ts`  | `user.form.remote.ts`         | `consumable-product.form.remote.ts`                     |
| **Funciones exportadas**      | `camelCase`           | `createUser`, `getUserList`   | `createConsumableProduct`, `getConsumableProductList`   |
| **Componentes Svelte**        | `PascalCase.svelte`   | `UserTable.svelte`            | `ConsumableProductTable.svelte`                         |
| **Modelo Prisma 8**           | `PascalCase`          | `User` (`db.orm.public.User`) | `ConsumableProduct` (`db.orm.public.ConsumableProduct`) |
| **Ruta en URL (`routes/`)**   | `(app)/kebab-case/`   | `routes/(app)/usuarios/`      | `routes/(app)/productos-consumibles/`                   |

---

## 📋 Referencia de Comandos (Desarrollo)

| Comando             | Ejecuta internamente                                         | Propósito                                                 |
| :------------------ | :----------------------------------------------------------- | :-------------------------------------------------------- |
| `pnpm dev`          | `vite dev`                                                   | Inicia la aplicación con recarga en caliente.             |
| `pnpm worker:dev`   | `tsx watch --env-file=.env src/worker.ts`                    | Inicia el worker con recarga en caliente.                 |
| `pnpm seed`         | `tsx --env-file=.env src/prisma/seed.ts`                     | Inserta los usuarios y catálogos base en desarrollo.      |
| `pnpm fix`          | `biome check --write .`                                      | Revisa y corrige formato, linter e imports (Biome).       |
| `pnpm format`       | `biome format --write .`                                     | Formatea el código aplicando las reglas de estilo.        |
| `pnpm format:check` | `biome format .`                                             | Verifica el formato sin modificar archivos.               |
| `pnpm lint`         | `biome lint .`                                               | Inspecciona el código en busca de advertencias y errores. |
| `pnpm lint:fix`     | `biome lint --write .`                                       | Aplica soluciones automáticas sugeridas por el linter.    |
| `pnpm check`        | `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json` | Comprueba tipos estrictos de TypeScript y Svelte 5.       |
| `pnpm build`        | `vite build && vite build --config vite.worker.config.ts`    | Compila la app web y el worker para producción.           |

### 💡 Guía Rápida por Momento de Uso

#### 1. Al terminar de programar (Flujo diario antes de commit)

- **`pnpm fix`**: Limpia, formatea y corrige automáticamente todo el proyecto (atajo principal).
- **`pnpm check`**: Verifica que no existan errores de tipos en Svelte y TypeScript.
- **`pnpm build`**: Comprueba que la compilación de la app y del worker terminen con éxito.

#### 2. Solo lectura (Inspeccionar sin modificar ningún archivo)

- **`pnpm lint`**: Reporta advertencias y malas prácticas en terminal sin tocar archivos.
- **`pnpm format:check`**: Verifica si el código cumple las reglas de formato sin tocar archivos.

#### 3. Comandos quirúrgicos (Uso puntual)

- **`pnpm format`**: Aplica únicamente reglas de espaciado y formato visual en disco.
- **`pnpm lint:fix`**: Aplica únicamente correcciones automáticas de linter en disco.

---

- ⬅️ [Volver al README](../README.md)
- ⚙️ [Guía de Producción](prod.md) ➡️
