<script lang="ts">
import type { Snippet } from "svelte";

import { X } from "@lucide/svelte";

import Modal from "#lib/components/ui/modals/Modal.svelte";

interface Props {
	isOpen: boolean;
	onRequestClose: () => void;
	width: "small" | "medium" | "large" | string;
	header: Snippet;
	children: Snippet;
}

let { isOpen, onRequestClose, width, header, children }: Props = $props();
</script>

<Modal {isOpen} {onRequestClose} {width}>
	<div
		class="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900"
	>
		<div
			class="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3.5 sm:px-7 sm:py-5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="mr-2 flex min-w-0 flex-1 items-center gap-2.5 sm:mr-3 sm:gap-3.5"
			>
				{@render header()}
			</div>
			<button
				type="button"
				class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 transition-colors duration-150 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
				onclick={() => onRequestClose()}
				aria-label="Cerrar modal"
			>
				<X size={18} class="sm:size-5" />
			</button>
		</div>

		<div
			class="flex min-h-0 flex-1 flex-col overflow-hidden p-3.5 sm:p-6 md:p-7"
		>
			{@render children()}
		</div>
	</div>
</Modal>
