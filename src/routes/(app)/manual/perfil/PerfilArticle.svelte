<script lang="ts">
import { HelpCircle, KeyRound, Laptop, User, UserCheck } from "@lucide/svelte";

import { PERFIL_FAQS } from "./perfil.data";
</script>

<article class="article-content">
	<!-- 1. Introducción a Mi Perfil -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<UserCheck size={14} />
				Gestión Personal
			</span>
			<h3 class="section-title">Tu Espacio Individual de Cuenta</h3>
			<p class="section-desc">
				El módulo Mi Perfil permite a cada colaborador actualizar sus datos de
				contacto y velar por la seguridad de su acceso sin depender del área de
				soporte.
			</p>
		</div>

		<div class="cards-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<User size={18} />
				</div>
				<h4 class="feature-title">Información Personal</h4>
				<p class="feature-desc">
					Mantén tu nombre completo, usuario y correo institucional siempre
					actualizados para recibir notificaciones y alertas operativas.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<KeyRound size={18} />
				</div>
				<h4 class="feature-title">Cambio de Contraseña</h4>
				<p class="feature-desc">
					Modifica tu clave en cualquier momento validando tu contraseña actual.
					Tu nueva clave debe contar con al menos 8 caracteres.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Laptop size={18} />
				</div>
				<h4 class="feature-title">Auditoría de Sesiones</h4>
				<p class="feature-desc">
					Revisa la lista de navegadores donde tu cuenta permanece activa y
					expulsa accesos remotos con un solo clic.
				</p>
			</div>
		</div>
	</section>

	<!-- 2. Preguntas Frecuentes -->
	<section class="section-block">
		<div class="section-header">
			<span class="section-badge">
				<HelpCircle size={14} />
				Dudas Comunes
			</span>
			<h3 class="section-title">Preguntas Frecuentes sobre Mi Perfil</h3>
		</div>

		<div class="faqs-list">
			{#each PERFIL_FAQS as faq}
				<div class="faq-card">
					<h4 class="faq-question">{faq.q}</h4>
					<p class="faq-answer">{faq.a}</p>
				</div>
			{/each}
		</div>
	</section>
</article>

<style>
.article-content {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
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
	gap: 0.35rem;
	align-items: center;
	width: fit-content;
	padding: 0.2rem 0.6rem;
	font-size: 0.72rem;
	font-weight: 700;
	color: light-dark(oklch(40% 0.12 250), oklch(80% 0.1 250));
	text-transform: uppercase;
	letter-spacing: 0.05em;
	background-color: light-dark(oklch(95% 0.02 250), oklch(27% 0.03 260));
	border-radius: 999px;
}

.section-title {
	font-size: 1.25rem;
	font-weight: 750;
	color: light-dark(oklch(20% 0.02 255), oklch(98% 0.01 255));
}

.section-desc {
	font-size: 0.9rem;
	line-height: 1.5;
	color: light-dark(oklch(48% 0.02 255), oklch(72% 0.02 255));
}

.cards-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 1rem;
}

.feature-card {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	padding: 1.25rem;
	background-color: light-dark(oklch(100% 0 0), oklch(22% 0.018 260));
	border: 1px solid light-dark(oklch(91% 0.01 250), oklch(28% 0.015 260));
	border-radius: 14px;
}

.feature-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	color: light-dark(oklch(40% 0.14 250), oklch(80% 0.12 250));
	background-color: light-dark(oklch(95% 0.02 250), oklch(27% 0.03 260));
	border-radius: 10px;
}

.feature-title {
	font-size: 0.95rem;
	font-weight: 700;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.01 255));
}

.feature-desc {
	font-size: 0.84rem;
	line-height: 1.45;
	color: light-dark(oklch(50% 0.02 255), oklch(70% 0.02 255));
}

.faqs-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.faq-card {
	padding: 1.15rem;
	background-color: light-dark(oklch(100% 0 0), oklch(22% 0.018 260));
	border: 1px solid light-dark(oklch(91% 0.01 250), oklch(28% 0.015 260));
	border-radius: 12px;
}

.faq-question {
	margin-bottom: 0.35rem;
	font-size: 0.92rem;
	font-weight: 700;
	color: light-dark(oklch(22% 0.02 255), oklch(95% 0.01 255));
}

.faq-answer {
	font-size: 0.85rem;
	line-height: 1.45;
	color: light-dark(oklch(48% 0.02 255), oklch(72% 0.02 255));
}
</style>
