<script lang="ts">
import {
	Check,
	ChevronDown,
	Eye,
	HelpCircle,
	KeyRound,
	Pencil,
	Shield,
	ShieldAlert,
	SlidersHorizontal,
	TableProperties,
	ToggleRight,
	Trash2,
	User,
	UserPlus,
} from "@lucide/svelte";

const userFaqs = [
	{
		q: "¿Qué debo hacer si un colaborador olvida su contraseña?",
		a: "No es necesario eliminar su cuenta ni crear una nueva. Haz clic en el botón 'Editar' (icono de lápiz) en su fila, escribe una nueva clave en el campo 'Nueva Contraseña' y presiona Guardar. La nueva clave entrará en vigor de inmediato.",
	},
	{
		q: "¿Por qué el sistema me impide desactivar o eliminar mi propia cuenta?",
		a: "Por política estricta de seguridad informática, la plataforma bloquea los botones de suspensión y eliminación en el usuario con el que te encuentras conectado. Esto previene que la empresa se quede accidentalmente sin ningún administrador con acceso al sistema.",
	},
	{
		q: "¿Qué ocurre si aparece una alerta roja indicando que el correo ya existe?",
		a: "Cada dirección de correo electrónico debe ser única en todo el sistema. Si el correo ya fue registrado anteriormente (incluso por un usuario inactivo), deberás utilizar una dirección alternativa o reactivar la cuenta previa si aún existe.",
	},
	{
		q: "¿Por qué un usuario con perfil Consulta no puede editar ni borrar?",
		a: "El perfil Consulta está pensado para supervisión y auditoría. El sistema bloquea automáticamente cualquier intento de modificación para evitar errores operativos o pérdida accidental de información.",
	},
	{
		q: "¿Al retirar a un colaborador se borran las operaciones que realizó en el pasado?",
		a: "No. El retiro anula permanentemente el inicio de sesión y cierra sus sesiones activas, pero todas las transacciones, ventas o registros históricos que haya creado se conservan intactos para fines contables y de auditoría.",
	},
];
</script>

<article class="article-content">
	<!-- 1. Perfiles y Permisos (Guía Ejecutiva) -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<Shield size={14} />
				Roles de Acceso
			</span>
			<h3 class="section-title">Niveles de Perfil en la Plataforma</h3>
			<p class="section-desc">
				Al dar de alta a un colaborador, debes asignarle uno de los tres
				perfiles disponibles según sus responsabilidades en la empresa:
			</p>
		</div>

		<div class="roles-grid">
			<div class="role-card admin">
				<div class="role-badge-row">
					<span class="role-pill admin">Administrador</span>
					<span class="role-tag">Control Total</span>
				</div>
				<div class="role-header">
					<span class="role-icon"><ShieldAlert size={20} /></span>
					<h4 class="role-title">Gestión y Administración</h4>
				</div>
				<p class="role-desc">
					Para directivos y encargados de área. Permite dar de alta personal,
					suspender accesos, reasignar claves y supervisar todos los módulos del
					sistema.
				</p>
			</div>

			<div class="role-card user">
				<div class="role-badge-row">
					<span class="role-pill user">Operador</span>
					<span class="role-tag">Trabajo Diario</span>
				</div>
				<div class="role-header">
					<span class="role-icon"><User size={20} /></span>
					<h4 class="role-title">Colaborador Operativo</h4>
				</div>
				<p class="role-desc">
					Perfil para el equipo de trabajo general. Permite registrar datos,
					consultar su información y operar las funciones del negocio sin acceso
					a la administración de otros usuarios.
				</p>
			</div>

			<div class="role-card viewer">
				<div class="role-badge-row">
					<span class="role-pill viewer">Consulta</span>
					<span class="role-tag">Solo Lectura</span>
				</div>
				<div class="role-header">
					<span class="role-icon"><Eye size={20} /></span>
					<h4 class="role-title">Auditoría y Supervisión</h4>
				</div>
				<p class="role-desc">
					Para auditores o personal en entrenamiento. Permite revisar reportes y
					datos con seguridad total, bloqueando cualquier acción de modificación
					o eliminación.
				</p>
			</div>
		</div>
	</section>

	<!-- 2. Anatomía Visual de la Pantalla -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<TableProperties size={14} />
				Estructura
			</span>
			<h3 class="section-title">Anatomía de la Pantalla de Usuarios</h3>
			<p class="section-desc">
				Elementos que encontrarás al ingresar al módulo de
				<strong>Usuarios</strong>:
			</p>
		</div>

		<div class="anatomy-grid">
			<div class="anatomy-card">
				<div class="anatomy-card-top">
					<span class="anatomy-icon primary"><UserPlus size={18} /></span>
					<span class="anatomy-label">Barra Superior</span>
				</div>
				<h4 class="anatomy-title">Botón "+ Nuevo Usuario"</h4>
				<p class="anatomy-text">
					Ubicado en la esquina superior derecha. Abre la ventana para registrar
					a un nuevo colaborador completando su ficha básica de acceso.
				</p>
			</div>

			<div class="anatomy-card">
				<div class="anatomy-card-top">
					<span class="anatomy-icon success"
						><SlidersHorizontal size={18} /></span
					>
					<span class="anatomy-label">Tabla Principal</span>
				</div>
				<h4 class="anatomy-title">Columnas Informativas</h4>
				<p class="anatomy-text">
					Presenta el <strong>Nombre Completo</strong>,
					<strong>Usuario</strong>,
					<strong>Correo Corporativo</strong>
					y el <strong>Rol</strong> asignado.
				</p>
			</div>

			<div class="anatomy-card">
				<div class="anatomy-card-top">
					<span class="anatomy-icon info"><ToggleRight size={18} /></span>
					<span class="anatomy-label">Control de Estado</span>
				</div>
				<h4 class="anatomy-title">Switch Activo / Inactivo</h4>
				<p class="anatomy-text">
					Un interruptor interactivo por colaborador para pausar o reactivar su
					acceso en el acto sin alterar su cuenta.
				</p>
			</div>

			<div class="anatomy-card">
				<div class="anatomy-card-top">
					<span class="anatomy-icon warning"><Pencil size={18} /></span>
					<span class="anatomy-label">Acciones Directas</span>
				</div>
				<h4 class="anatomy-title">Editar y Eliminar</h4>
				<p class="anatomy-text">
					El botón de lápiz para cambiar datos o resetear contraseñas, y el bote
					de basura para el retiro definitivo del colaborador.
				</p>
			</div>
		</div>
	</section>

	<!-- 3. Procedimientos Paso a Paso -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<Check size={14} />
				Operaciones
			</span>
			<h3 class="section-title">Guía de Operaciones Paso a Paso</h3>
			<p class="section-desc">
				Instrucciones directas para resolver las 4 tareas habituales de
				administración de cuentas:
			</p>
		</div>

		<div class="steps-grid">
			<!-- Tarea 1: Alta -->
			<div class="step-card">
				<div class="step-card-header">
					<span class="step-icon create"><UserPlus size={20} /></span>
					<div>
						<h4 class="step-card-title">1. Registrar un Nuevo Colaborador</h4>
						<span class="step-card-subtitle">Formulario de Alta</span>
					</div>
				</div>
				<p class="step-card-desc">
					Sigue estos pasos ante una nueva incorporación a la empresa:
				</p>
				<ol class="step-list-ordered">
					<li>
						Haz clic en el botón <strong>"+ Nuevo Usuario"</strong> en la parte
						superior derecha.
					</li>
					<li>
						Ingresa el <strong>Nombre Completo</strong> y define un
						<strong>Usuario</strong>
						para su inicio de sesión.
					</li>
					<li>
						Escribe su <strong>Correo Corporativo</strong> y selecciona el
						<strong>Rol</strong>
						adecuado.
					</li>
					<li>
						Asigna una <strong>Contraseña Inicial</strong> y presiona
						<strong>"Guardar"</strong>.
					</li>
				</ol>
			</div>

			<!-- Tarea 2: Pausar o Reactivar -->
			<div class="step-card">
				<div class="step-card-header">
					<span class="step-icon toggle"><ToggleRight size={20} /></span>
					<div>
						<h4 class="step-card-title">2. Suspender o Reactivar un Acceso</h4>
						<span class="step-card-subtitle"
							>Control Inmediato sin Borrar Datos</span
						>
					</div>
				</div>
				<p class="step-card-desc">
					Para licencias, vacaciones o situaciones preventivas:
				</p>
				<ol class="step-list-ordered">
					<li>Ubica la fila del colaborador en la tabla principal.</li>
					<li>
						Haz clic directamente sobre el interruptor en la columna
						<strong>Estado</strong>.
					</li>
					<li>
						<strong>Efecto en vivo:</strong>
						Al pasar a <em>Inactivo</em>, cualquier sesión abierta del
						colaborador se cierra en el mismo segundo.
					</li>
					<li>
						Para reactivarlo al regresar, vuelve a pulsar el interruptor a
						<em>Activo</em>.
					</li>
				</ol>
			</div>

			<!-- Tarea 3: Modificar y Resetear Claves -->
			<div class="step-card">
				<div class="step-card-header">
					<span class="step-icon update"><KeyRound size={20} /></span>
					<div>
						<h4 class="step-card-title">3. Resetear Contraseñas Olvidadas</h4>
						<span class="step-card-subtitle"
							>Asistencia Rápida al Personal</span
						>
					</div>
				</div>
				<p class="step-card-desc">Si un compañero no recuerda su contraseña:</p>
				<ol class="step-list-ordered">
					<li>
						Presiona el botón de <strong>"Editar"</strong> (icono de lápiz) en
						su fila.
					</li>
					<li>
						Escribe una nueva contraseña en el campo
						<strong>"Nueva Contraseña"</strong>.
					</li>
					<li>
						<em>Tip:</em>
						Si solo deseas cambiar su nombre o rol, deja la contraseña en blanco
						para conservarla.
					</li>
					<li>
						Presiona <strong>"Guardar Cambios"</strong> y facilítale la nueva
						clave a tu colaborador.
					</li>
				</ol>
			</div>

			<!-- Tarea 4: Baja Definitiva -->
			<div class="step-card">
				<div class="step-card-header">
					<span class="step-icon delete"><Trash2 size={20} /></span>
					<div>
						<h4 class="step-card-title">
							4. Retiro Definitivo del Colaborador
						</h4>
						<span class="step-card-subtitle">Baja Segura con Trazabilidad</span>
					</div>
				</div>
				<p class="step-card-desc">
					Cuando un colaborador se desvincula permanentemente:
				</p>
				<ol class="step-list-ordered">
					<li>
						Haz clic en el botón de <strong>"Eliminar"</strong> (icono de bote
						de basura).
					</li>
					<li>Confirma la acción en el diálogo de seguridad.</li>
					<li>Sus accesos y sesiones quedarán anulados inmediatamente.</li>
					<li>
						<strong>Historial preservado:</strong>
						Todas las transacciones o registros creados previamente por el
						colaborador quedan intactos para auditoría.
					</li>
				</ol>
			</div>
		</div>
	</section>

	<!-- 4. Preguntas Frecuentes del Módulo de Usuarios -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<HelpCircle size={14} />
				Resolución de Dudas
			</span>
			<h3 class="section-title">Preguntas Frecuentes de Usuarios</h3>
			<p class="section-desc">
				Respuestas a las situaciones más comunes durante la administración de
				colaboradores:
			</p>
		</div>

		<div class="faq-list">
			{#each userFaqs as { q, a }}
				<details class="faq-item">
					<summary class="faq-question">
						<span>{q}</span>
						<span class="faq-icon"><ChevronDown size={18} /></span>
					</summary>
					<div class="faq-answer">
						<p>{a}</p>
					</div>
				</details>
			{/each}
		</div>
	</section>
</article>

<style>
.article-content {
	display: flex;
	flex-direction: column;
	gap: 2.25rem;
}

.section-block {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.section-header {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.section-badge {
	display: inline-flex;
	gap: 0.4rem;
	align-items: center;
	align-self: flex-start;
	padding: 0.2rem 0.6rem;

	font-size: 0.72rem;
	font-weight: 700;
	color: light-dark(oklch(44% 0.12 250), oklch(78% 0.12 250));
	text-transform: uppercase;
	letter-spacing: 0.05em;

	background-color: light-dark(
		oklch(44% 0.12 250 / 0.08),
		oklch(78% 0.12 250 / 0.12)
	);
	border: 1px solid
		light-dark(oklch(44% 0.12 250 / 0.15), oklch(78% 0.12 250 / 0.2));
	border-radius: 9999px;
}

.section-title {
	margin: 0;
	font-size: 1.18rem;
	font-weight: 750;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.005 255));
	letter-spacing: -0.015em;
}

.section-desc {
	margin: 0;
	font-size: 0.9rem;
	line-height: 1.55;
	color: light-dark(oklch(46% 0.01 255), oklch(72% 0.01 255));
}

.roles-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.15rem;
}

.role-card {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1.35rem;

	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(31% 0.014 248));
	border-radius: 16px;
}

.role-badge-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.role-pill {
	display: inline-flex;
	padding: 0.2rem 0.55rem;
	font-size: 0.72rem;
	font-weight: 750;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	border-radius: 6px;

	&.admin {
		color: light-dark(oklch(40% 0.16 25), oklch(80% 0.14 25));
		background-color: light-dark(oklch(95% 0.03 25), oklch(28% 0.04 25));
	}

	&.user {
		color: light-dark(oklch(38% 0.15 250), oklch(80% 0.13 250));
		background-color: light-dark(oklch(95% 0.03 250), oklch(28% 0.04 250));
	}

	&.viewer {
		color: light-dark(oklch(42% 0.14 150), oklch(80% 0.12 150));
		background-color: light-dark(oklch(95% 0.03 150), oklch(28% 0.04 150));
	}
}

.role-tag {
	font-size: 0.72rem;
	font-weight: 600;
	color: light-dark(oklch(50% 0.01 255), oklch(65% 0.01 255));
}

.role-header {
	display: flex;
	gap: 0.55rem;
	align-items: center;
}

.role-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: light-dark(oklch(40% 0.14 250), oklch(78% 0.12 250));
}

.role-title {
	margin: 0;
	font-size: 0.94rem;
	font-weight: 700;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.005 255));
}

.role-desc {
	margin: 0;
	font-size: 0.84rem;
	line-height: 1.5;
	color: light-dark(oklch(44% 0.01 255), oklch(74% 0.008 255));
}

.anatomy-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
}

.anatomy-card {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	padding: 1.25rem;

	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(31% 0.014 248));
	border-radius: 16px;
}

.anatomy-card-top {
	display: flex;
	gap: 0.6rem;
	align-items: center;
}

.anatomy-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	inline-size: 32px;
	block-size: 32px;
	border-radius: 8px;

	&.primary {
		color: light-dark(oklch(40% 0.14 250), oklch(80% 0.12 250));
		background-color: light-dark(oklch(94% 0.03 250), oklch(30% 0.04 250));
	}

	&.success {
		color: light-dark(oklch(40% 0.14 150), oklch(80% 0.12 150));
		background-color: light-dark(oklch(94% 0.03 150), oklch(30% 0.04 150));
	}

	&.info {
		color: light-dark(oklch(40% 0.14 210), oklch(80% 0.12 210));
		background-color: light-dark(oklch(94% 0.03 210), oklch(30% 0.04 210));
	}

	&.warning {
		color: light-dark(oklch(45% 0.14 70), oklch(82% 0.12 70));
		background-color: light-dark(oklch(94% 0.03 70), oklch(30% 0.04 70));
	}
}

.anatomy-label {
	font-size: 0.72rem;
	font-weight: 700;
	color: light-dark(oklch(50% 0.01 255), oklch(65% 0.01 255));
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.anatomy-title {
	margin: 0;
	font-size: 0.94rem;
	font-weight: 700;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.005 255));
}

.anatomy-text {
	margin: 0;
	font-size: 0.84rem;
	line-height: 1.5;
	color: light-dark(oklch(45% 0.01 255), oklch(74% 0.008 255));
}

.steps-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
	gap: 1.25rem;
}

.step-card {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
	padding: 1.5rem;

	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(31% 0.014 248));
	border-radius: 18px;
}

.step-card-header {
	display: flex;
	gap: 0.85rem;
	align-items: center;
}

.step-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	inline-size: 42px;
	block-size: 42px;
	border-radius: 12px;

	&.create {
		color: light-dark(oklch(40% 0.12 150), oklch(80% 0.12 150));
		background-color: light-dark(oklch(95% 0.03 150), oklch(30% 0.04 150));
	}

	&.toggle {
		color: light-dark(oklch(40% 0.12 250), oklch(80% 0.12 250));
		background-color: light-dark(oklch(95% 0.03 250), oklch(30% 0.04 250));
	}

	&.update {
		color: light-dark(oklch(40% 0.12 300), oklch(80% 0.12 300));
		background-color: light-dark(oklch(95% 0.03 300), oklch(30% 0.04 300));
	}

	&.delete {
		color: light-dark(oklch(45% 0.12 25), oklch(80% 0.12 25));
		background-color: light-dark(oklch(95% 0.03 25), oklch(30% 0.04 25));
	}
}

.step-card-title {
	margin: 0;
	font-size: 0.98rem;
	font-weight: 700;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.005 255));
}

.step-card-subtitle {
	font-size: 0.76rem;
	font-weight: 600;
	color: light-dark(oklch(50% 0.01 255), oklch(68% 0.01 255));
}

.step-card-desc {
	margin: 0;
	font-size: 0.86rem;
	line-height: 1.5;
	color: light-dark(oklch(44% 0.01 255), oklch(75% 0.008 255));
}

.step-list-ordered {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	padding-left: 1.25rem;
	margin: 0.25rem 0 0;

	& li {
		font-size: 0.84rem;
		line-height: 1.5;
		color: light-dark(oklch(36% 0.015 255), oklch(84% 0.01 255));
	}
}

.faq-list {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.faq-item {
	overflow: hidden;
	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(31% 0.014 248));
	border-radius: 16px;
	transition: border-color 0.15s ease;

	&[open] {
		border-color: light-dark(oklch(75% 0.05 240), oklch(45% 0.05 240));

		& .faq-icon {
			transform: rotate(180deg);
		}
	}
}

.faq-question {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem;
	font-size: 0.95rem;
	font-weight: 650;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.005 255));
	cursor: pointer;
	user-select: none;
	list-style: none;

	&::-webkit-details-marker {
		display: none;
	}
}

.faq-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: light-dark(oklch(50% 0.02 255), oklch(70% 0.01 255));
	transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-answer {
	padding: 0 1.5rem 1.25rem;
	border-top: 1px solid light-dark(oklch(92% 0.006 248), oklch(27% 0.015 260));

	& p {
		margin: 0.75rem 0 0;
		font-size: 0.88rem;
		line-height: 1.6;
		color: light-dark(oklch(40% 0.01 255), oklch(78% 0.008 255));
	}
}
</style>
