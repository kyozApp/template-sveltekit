<script lang="ts">
import {
	ChevronDown,
	CircleCheck,
	Compass,
	Laptop,
	LayoutDashboard,
	LogOut,
	Moon,
	MousePointerClick,
	PanelLeft,
	ShieldCheck,
	Smartphone,
	Sparkles,
} from "@lucide/svelte";

import { DASHBOARD_FAQS } from "./dashboard.data";
</script>

<article class="article-content">
	<!-- 1. Propósito del Dashboard -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<LayoutDashboard size={14} />
				Punto de Partida
			</span>
			<h3 class="section-title">¿Qué es el Dashboard?</h3>
			<p class="section-desc">
				El <strong>Dashboard (Panel de Control)</strong> es la pantalla
				principal que te recibe al iniciar sesión. Su objetivo es brindarte una
				vista centralizada y rápida del estado de tus operaciones, facilitando
				el acceso a los módulos que usas en tu día a día sin distracciones.
			</p>
		</div>

		<div class="features-grid">
			<div class="feature-card">
				<div class="feature-icon primary">
					<Sparkles size={20} />
				</div>
				<h4 class="feature-title">Acceso Instantáneo</h4>
				<p class="feature-desc">
					Toda la información clave de tu área se encuentra disponible en tiempo
					real, permitiéndote comenzar tu jornada sin esperas ni configuraciones
					complejas.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon success">
					<Laptop size={20} />
				</div>
				<h4 class="feature-title">Diseño Adaptable</h4>
				<p class="feature-desc">
					La interfaz se ajusta con fluidez a monitores de escritorio,
					computadoras portátiles, tablets y pantallas de teléfonos móviles.
				</p>
			</div>
		</div>
	</section>

	<!-- 2. Elementos del Entorno y Navegación -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<Compass size={14} />
				Navegación
			</span>
			<h3 class="section-title">Controles Globales de la Interfaz</h3>
			<p class="section-desc">
				Herramientas siempre accesibles en la parte superior y lateral de la
				pantalla:
			</p>
		</div>

		<div class="controls-grid">
			<div class="control-card">
				<div class="control-header">
					<span class="control-icon"><PanelLeft size={18} /></span>
					<h4 class="control-title">Menú Lateral Colapsable</h4>
				</div>
				<p class="control-desc">
					Presiona el botón de menú en la esquina superior para colapsar la
					barra lateral. Esto amplía el espacio de lectura, ideal para
					visualizar tablas con muchas columnas.
				</p>
			</div>

			<div class="control-card">
				<div class="control-header">
					<span class="control-icon"><MousePointerClick size={18} /></span>
					<h4 class="control-title">Migas de Pan (Breadcrumbs)</h4>
				</div>
				<p class="control-desc">
					Ubicadas en la barra superior (ejemplo:
					<code>DASHBOARD &gt; USUARIOS</code>). Indican tu posición actual y te
					permiten regresar a niveles anteriores con un solo clic.
				</p>
			</div>

			<div class="control-card">
				<div class="control-header">
					<span class="control-icon"><Moon size={18} /></span>
					<h4 class="control-title">Modo Claro y Oscuro</h4>
				</div>
				<p class="control-desc">
					Alterna entre modo claro u oscuro presionando el icono del sol/luna.
					Reduce el cansancio visual en jornadas nocturnas o ambientes de baja
					luz.
				</p>
			</div>

			<div class="control-card">
				<div class="control-header">
					<span class="control-icon"><LogOut size={18} /></span>
					<h4 class="control-title">Cierre de Sesión Seguro</h4>
				</div>
				<p class="control-desc">
					El botón de salida en el extremo superior derecho desconecta tu cuenta
					y anula tu sesión en el servidor inmediatamente por seguridad.
				</p>
			</div>
		</div>
	</section>

	<!-- 3. Comodidad y Atajos -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<ShieldCheck size={14} />
				Productividad
			</span>
			<h3 class="section-title">Atajos y Buenas Prácticas</h3>
		</div>

		<div class="tips-box">
			<ul class="tips-list">
				<li>
					<CircleCheck size={16} />
					<div>
						<strong>Cierre rápido con tecla Escape (ESC)</strong>: Puedes cerrar
						cualquier ventana modal o diálogo emergente simplemente pulsando la
						tecla <code>ESC</code>
						en tu teclado, sin necesidad de buscar la 'X' con el mouse.
					</div>
				</li>
				<li>
					<CircleCheck size={16} />
					<div>
						<strong>Validaciones inmediatas</strong>: Si un campo obligatorio
						queda vacío o un dato no cumple el formato esperado, el sistema te
						lo indicará en texto rojo antes de enviar el formulario para evitar
						errores.
					</div>
				</li>
				<li>
					<CircleCheck size={16} />
					<div>
						<strong>Navegación táctil en móviles</strong>: En smartphones, la
						barra lateral se convierte en un menú deslizante y las tablas
						permiten desplazamiento lateral cómodo con el dedo.
					</div>
				</li>
			</ul>
		</div>
	</section>

	<!-- 4. Preguntas Frecuentes Generales -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<Smartphone size={14} />
				Ayuda Rápida
			</span>
			<h3 class="section-title">Preguntas Frecuentes del Sistema</h3>
			<p class="section-desc">
				Respuestas directas a las consultas más usuales sobre el uso general de
				la plataforma:
			</p>
		</div>

		<div class="faq-list">
			{#each DASHBOARD_FAQS as { q, a }}
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

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.15rem;
}

.feature-card {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	padding: 1.35rem;

	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(31% 0.014 248));
	border-radius: 16px;
}

.feature-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	inline-size: 40px;
	block-size: 40px;
	border-radius: 12px;

	&.primary {
		color: light-dark(oklch(40% 0.14 250), oklch(80% 0.12 250));
		background-color: light-dark(oklch(94% 0.03 250), oklch(30% 0.04 250));
	}

	&.success {
		color: light-dark(oklch(40% 0.14 150), oklch(80% 0.12 150));
		background-color: light-dark(oklch(94% 0.03 150), oklch(30% 0.04 150));
	}
}

.feature-title {
	margin: 0;
	font-size: 0.96rem;
	font-weight: 700;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.005 255));
}

.feature-desc {
	margin: 0;
	font-size: 0.85rem;
	line-height: 1.5;
	color: light-dark(oklch(45% 0.01 255), oklch(74% 0.008 255));
}

.controls-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 1.15rem;
}

.control-card {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	padding: 1.25rem;

	background-color: light-dark(
		oklch(98.8% 0.003 248),
		oklch(24.94% 0.0304 256.86)
	);
	border: 1px solid light-dark(oklch(89% 0.006 248), oklch(31% 0.014 248));
	border-radius: 16px;
}

.control-header {
	display: flex;
	gap: 0.6rem;
	align-items: center;
}

.control-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	color: light-dark(oklch(40% 0.14 250), oklch(78% 0.12 250));
}

.control-title {
	margin: 0;
	font-size: 0.92rem;
	font-weight: 700;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.005 255));
}

.control-desc {
	margin: 0;
	font-size: 0.84rem;
	line-height: 1.5;
	color: light-dark(oklch(45% 0.01 255), oklch(74% 0.008 255));

	& code {
		padding: 0.12rem 0.35rem;
		font-family: inherit;
		font-size: 0.8rem;
		background-color: light-dark(oklch(93% 0.01 248), oklch(30% 0.02 256.86));
		border-radius: 6px;
	}
}

.tips-box {
	padding: 1.25rem 1.5rem;
	background-color: light-dark(oklch(96% 0.015 250), oklch(26% 0.025 256.86));
	border: 1px solid light-dark(oklch(88% 0.02 250), oklch(34% 0.03 256.86));
	border-radius: 16px;
}

.tips-list {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
	padding: 0;
	margin: 0;
	list-style: none;

	& li {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		font-size: 0.86rem;
		line-height: 1.5;
		color: light-dark(oklch(36% 0.015 255), oklch(84% 0.01 255));

		& code {
			padding: 0.12rem 0.35rem;
			font-family: inherit;
			font-size: 0.8rem;
			background-color: light-dark(
				oklch(92% 0.015 250),
				oklch(32% 0.03 256.86)
			);
			border-radius: 6px;
		}
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
