<script lang="ts">
import { ROLE_LABELS, type Role } from "#lib/constants.ts";
import type { UserListItemResponse } from "#lib/validations/user/user.query.validation.ts";

interface Props {
	role: UserListItemResponse["role"];
}

let { role }: Props = $props();
</script>

<span class="role-badge" data-role={role}>
	{ROLE_LABELS[role as Role]}
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
		color: light-dark(oklch(46% 0.135 245), oklch(72% 0.12 245));
		background-color: light-dark(oklch(95.6% 0.02 245), oklch(28% 0.028 245));
	}

	&[data-role="USER"] {
		color: light-dark(oklch(45% 0.12 180), oklch(72% 0.1 180));
		background-color: light-dark(oklch(95.6% 0.02 180), oklch(28% 0.025 180));
	}

	&[data-role="VIEWER"] {
		color: light-dark(oklch(50% 0.01 255), oklch(75% 0.01 255));
		background-color: light-dark(oklch(95.8% 0.005 255), oklch(28% 0.01 255));
	}
}
</style>
