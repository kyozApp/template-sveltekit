<script lang="ts">
import type { Component, Snippet } from "svelte";

import { X } from "@lucide/svelte";

import Modal from "#lib/components/ui/modals/Modal.svelte";

interface Props {
	isOpen: boolean;
	onRequestClose: () => void;
	width: "small" | "medium" | "large" | string;
	title: string;
	subtitle: string;
	icon: Component<{ size?: number | string; class?: string }>;
	children: Snippet;
}

let {
	isOpen,
	onRequestClose,
	width,
	title,
	subtitle,
	icon: Icon,
	children,
}: Props = $props();
</script>

<Modal {isOpen} {onRequestClose} {width}>
	<div
		class="flex w-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900"
	>
		<div
			class="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 sm:px-7 sm:py-5 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="flex items-center gap-3.5">
				<div class="flex items-center gap-3.5">
					<div
						class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Icon size={22} />
					</div>
					<div>
						<h2
							id="modal-title"
							class="text-base font-bold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-100"
						>
							{title}
						</h2>
						<p
							class="text-xs font-medium text-zinc-500 sm:text-sm dark:text-zinc-400"
						>
							{subtitle}
						</p>
					</div>
				</div>
			</div>
			<button
				type="button"
				class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 transition-colors duration-150 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
				onclick={() => onRequestClose()}
				aria-label="Cerrar vista previa"
			>
				<X size={20} />
			</button>
		</div>

		<div class="flex h-[75vh] w-full flex-col overflow-hidden p-0">
			{@render children()}
		</div>
	</div>
</Modal>
