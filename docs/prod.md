# 🚀 Producción

Runbook de despliegue y operación para ejecutar **mi-app** en producción con
**SvelteKit**, **@sveltejs/adapter-node**, **Worker en segundo plano** y **Systemd**.

---

## ✅ Requisitos Previos

- **Servidor Linux** Ubuntu con `systemd`.
- **Node.js**: `24.21.0`
- **pnpm**: `12.3.4`
- **PostgreSQL 18** accesible en el puerto `5432` (local o servicio administrado).
- Acceso SSH al host y permisos de `sudo` para administrar `/etc/systemd/system/`.

> [!TIP]
> **Crear tu propio runbook privado (`prod.local.md`):**
> Si prefieres tener un archivo con las IPs, usuarios y comandos exactos de tu VPS listos para
> copiar y pegar sin exponer tus datos a Git (ya protegido en `.gitignore`):
>
> - **Paso 1:** Copia la plantilla:
>
> ```bash
> cp docs/prod.md docs/prod.local.md
> ```
>
> - **Paso 2:** Haz un **Buscar y Reemplazar** en `prod.local.md` de estos 4 valores:
>   - `mi-servidor` IP o dominio de tu VPS.
>   - `mi-usuario` Tu usuario Linux (actualiza SSH, rsync y Systemd).
>   - `-p 22` Tu puerto SSH si es personalizado.
>   - `8000` El puerto de tu aplicación web en producción si difiere.

<details>
<summary>📋 Preparar un servidor VPS nuevo desde cero en Ubuntu</summary>

Si tu servidor VPS está recién creado, ejecuta estos pasos para instalar y configurar el entorno:

### 1. Actualizar el sistema operativo

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar herramientas esenciales

```bash
sudo apt install -y curl unzip build-essential
```

### 3. Instalar pnpm y Node.js

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
pnpm runtime set node lts -g
```

Verificar versiones:

```bash
node -v
pnpm -v
```

</details>

---

## 🚀 Despliegue Inicial (Primera Vez)

### 1. Sincronizar el código al servidor

Desde tu máquina local, transfiere el código mediante `rsync`:

```bash
rsync -avz -e 'ssh -p 22' \
  --exclude '.env' \
  --exclude 'node_modules/' \
  --exclude 'build/' \
  --exclude '.svelte-kit/' \
  ./ mi-usuario@mi-servidor:~/proyectos/mi-app/
```

### 2. Conectarse al servidor VPS

Inicia sesión por SSH en tu servidor remoto:

```bash
ssh -p 22 mi-usuario@mi-servidor
```

Navega al directorio del proyecto:

```bash
cd ~/proyectos/mi-app
```

### 3. Configurar variables de entorno de producción

Copia la plantilla y edita las variables definitivas del servidor:

```bash
cp .env.example .env
nano .env
```

Asegúrate de configurar:

- `NODE_ENV=production`
- `PORT=8000`
- `ORIGIN="https://mi-dominio.com"` (o IP/puerto oficial para proteger CSRF)
- `DATABASE_URL` (cadena de conexión de PostgreSQL para Prisma 8)

### 4. Instalar dependencias

```bash
pnpm i
```

### 5. Inicializar base de datos y crear superadministrador

```bash
pnpm prisma contract emit
pnpm prisma db init
pnpm prisma db verify
pnpm seed
```

### 6. Compilar la aplicación y el worker para producción

```bash
pnpm build
```

Este comando compila en paralelo:

- `build/index.js`: Aplicación web SvelteKit gestionada por `@sveltejs/adapter-node`.
- `build/worker.js`: Worker de tareas en segundo plano compilado mediante Vite.

### 7. Crear los servicios en Systemd

La arquitectura desacopla el tráfico web de los procesos cron en dos unidades independientes:

#### Servicio de la Aplicación Web (`mi-app.service`)

Crea el archivo de configuración del servicio web:

```bash
sudo nano /etc/systemd/system/mi-app.service
```

Pega la siguiente configuración:

```ini
[Unit]
Description=Mi Aplicacion SvelteKit
After=network.target

[Service]
Type=simple
User=mi-usuario
WorkingDirectory=/home/mi-usuario/proyectos/mi-app
ExecStart=/home/mi-usuario/.local/share/pnpm/bin/node --env-file=.env build/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

# Parada limpia y gestión de subprocesos
KillMode=control-group
TimeoutStopSec=15

# Protección de recursos (Cgroups v2)
MemoryMax=500M
MemoryHigh=400M

# Logs centralizados con Journald
StandardOutput=journal
StandardError=journal
SyslogIdentifier=mi-app

[Install]
WantedBy=multi-user.target
```

#### Servicio del Worker (`mi-app-worker.service`)

Crea el archivo de configuración del worker de tareas en segundo plano:

```bash
sudo nano /etc/systemd/system/mi-app-worker.service
```

Pega la siguiente configuración:

```ini
[Unit]
Description=Mi Aplicacion Worker (Background Tasks)
After=network.target mi-app.service

[Service]
Type=simple
User=mi-usuario
WorkingDirectory=/home/mi-usuario/proyectos/mi-app
ExecStart=/home/mi-usuario/.local/share/pnpm/bin/node --env-file=.env build/worker.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

# Parada limpia y gestión de subprocesos
KillMode=control-group
TimeoutStopSec=15

# Protección de recursos (Cgroups v2)
MemoryMax=300M
MemoryHigh=250M

# Logs centralizados con Journald
StandardOutput=journal
StandardError=journal
SyslogIdentifier=mi-app-worker

[Install]
WantedBy=multi-user.target
```

### 8. Registrar e iniciar ambos servicios

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mi-app mi-app-worker
sudo systemctl status mi-app mi-app-worker
```

---

## 🔄 Actualizaciones Posteriores

### 1. Respaldo preventivo de la base de datos

Antes de aplicar cualquier cambio de esquema sobre datos reales, genera un respaldo:

```bash
mkdir -p ~/backups/mi-app
pg_dump "$DATABASE_URL" > ~/backups/mi-app/backup-antes-update-$(date +%F-%H%M%S).sql
```

### 2. Transferir cambios desde tu máquina local

```bash
rsync -avz -e 'ssh -p 22' \
  --exclude '.env' \
  --exclude 'node_modules/' \
  --exclude 'build/' \
  --exclude '.svelte-kit/' \
  ./ mi-usuario@mi-servidor:~/proyectos/mi-app/
```

_(O si sincronizas vía Git directamente en el servidor: `git pull origin main`)._

### 3. Conectarse por SSH al servidor

```bash
ssh -p 22 mi-usuario@mi-servidor
cd ~/proyectos/mi-app
```

### 4. En el servidor VPS: actualizar, compilar y reiniciar

Instalar dependencias:

```bash
pnpm i
```

Actualizar base de datos (solo si hubo modificaciones en `src/prisma/contract.ts`):

```bash
pnpm prisma contract emit
pnpm prisma db update
pnpm prisma db verify
```

Compilar la nueva versión (Web y Worker):

```bash
pnpm build
```

Reiniciar ambos servicios en Systemd:

```bash
sudo systemctl restart mi-app mi-app-worker
```

---

## 📊 Monitoreo y Operación

### Inspeccionar estado y logs en tiempo real

```bash
# Ver estado de ambos servicios
sudo systemctl status mi-app mi-app-worker

# Ver logs en vivo de la aplicación web
journalctl -u mi-app -f

# Ver logs en vivo del worker de segundo plano
journalctl -u mi-app-worker -f

# Ver últimas 100 líneas combinadas
journalctl -u mi-app -u mi-app-worker -n 100 --no-pager
```

### Filtrar errores y ventanas de tiempo en logs (Journald)

```bash
# Filtrar exclusivamente errores (sin ruido informativo)
journalctl -u mi-app -u mi-app-worker -p err --no-pager

# Ver logs de una ventana de tiempo específica (ejemplo: últimos 15 minutos)
journalctl -u mi-app --since "15 minutes ago"

# Ver logs generados desde el último reinicio del servidor
journalctl -u mi-app -u mi-app-worker -b

# Verificar uso de espacio en disco de los registros del sistema
journalctl --disk-usage
```

### Pausar, deshabilitar o reanudar servicios (Mantenimiento)

```bash
# Pausar temporalmente ambos servicios
sudo systemctl stop mi-app mi-app-worker

# Evitar que arranquen automáticamente en reinicios del host
sudo systemctl disable mi-app mi-app-worker

# Volver a habilitar el arranque automático e iniciarlos de inmediato
sudo systemctl enable --now mi-app mi-app-worker
sudo systemctl status mi-app mi-app-worker
```

### Diagnóstico de red y salud de la aplicación (Smoke Test)

```bash
# Probar respuesta HTTP real
curl -I http://localhost:8000/

# Comprobar que el puerto esté activo y en escucha en el sistema
ss -tulpn | grep 8000
```

---

## 📋 Referencia de Comandos (Producción)

| Comando             | Ejecuta internamente                                      | Propósito                                       |
| :------------------ | :-------------------------------------------------------- | :---------------------------------------------- |
| `pnpm build`        | `vite build && vite build --config vite.worker.config.ts` | Compila la app web y el worker para producción. |
| `pnpm preview`      | `vite preview`                                            | Previsualiza localmente el build web.           |
| `pnpm start`        | `node --env-file=.env build/index.js`                     | Inicia el servidor web SvelteKit en producción. |
| `pnpm worker:start` | `node --env-file=.env build/worker.js`                    | Inicia el worker de tareas en producción.       |

> [!NOTE]
> En un servidor de producción real, `pnpm start` y `pnpm worker:start` son gestionados
> automáticamente en segundo plano por los servicios de **Systemd** (`mi-app.service` y
> `mi-app-worker.service`).

---

- ⬅️ [Volver al README](../README.md)
- 📘 [Guía de Desarrollo (dev.md)](dev.md) ➡️
