<script lang="ts">
import type { UserListItemResponse } from "#lib/validations/user/user.query.validation";

interface Props {
	role: UserListItemResponse["role"];
}

let { role }: Props = $props();

const ROLE_LABELS: Record<string, string> = {
	SUPERADMIN: "Superadministrador",
	ADMIN: "Administrador",
	USER: "Usuario",
	VIEWER: "Visitante",
};
</script>

<span class="role-badge" data-role={role}>
	{ROLE_LABELS[role] ?? role}
</span>

<style>
.role-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	padding: 0.28rem 0.72rem;

	font-size: 0.68rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;

	background-color: light-dark(oklch(97.6% 0.004 248), oklch(22.5% 0.018 255));
	border-radius: 999px;

	&[data-role="SUPERADMIN"] {
		color: light-dark(oklch(49% 0.125 292), oklch(73% 0.115 292));
		background-color: light-dark(oklch(95.8% 0.02 292), oklch(29% 0.028 292));
	}

	&[data-role="ADMIN"] {
		color: light-dark(oklch(44% 0.11 265), oklch(72% 0.11 265));
		background-color: light-dark(oklch(95.5% 0.025 265), oklch(28% 0.03 265));
	}

	&[data-role="USER"] {
		color: light-dark(oklch(43% 0.065 195), oklch(69% 0.07 195));
		background-color: light-dark(oklch(95.7% 0.018 195), oklch(28% 0.024 195));
	}

	&[data-role="VIEWER"] {
		color: light-dark(oklch(40% 0.02 260), oklch(75% 0.02 260));
		background-color: light-dark(oklch(93% 0.01 260), oklch(27% 0.015 260));
	}
}
</style>
