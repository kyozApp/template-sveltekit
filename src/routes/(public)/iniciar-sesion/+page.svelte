<script lang="ts">
import { isHttpError } from "@sveltejs/kit";
import { fly } from "svelte/transition";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

import {
	CircleAlert,
	Eye,
	EyeOff,
	LoaderCircle,
	Lock,
	LogIn,
	User,
} from "@lucide/svelte";

import logo from "#lib/assets/favicon.svg";
import ThemeToggle from "#lib/components/ui/ThemeToggle.svelte";
import { loginUser } from "#lib/remote/auth/auth.form.remote.ts";
import { notifications } from "#lib/services/notifications.svelte.ts";
import { authLoginSchema } from "#lib/validations/auth/auth.form.validation.ts";

const { username: fieldUsername, password: fieldPassword } = loginUser.fields;

let showPassword = $state(false);

const submitting = $derived(loginUser.pending > 0);
</script>

<svelte:head>
	<title>Iniciar Sesión</title>
</svelte:head>

<main
	class="flex min-h-dvh w-full items-center justify-center bg-zinc-100 p-6 text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100"
>
	<div
		class="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-all duration-200 sm:rounded-3xl sm:p-9 sm:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
		in:fly={{ y: 8, duration: 300 }}
	>
		<div class="absolute top-5 right-5">
			<ThemeToggle />
		</div>

		<header class="mb-8 flex flex-col items-center gap-5 text-center">
			<div class="flex min-h-12 items-center justify-center">
				<img
					src={logo}
					alt="Logo de la aplicación"
					class="h-10 w-auto max-w-36 object-contain transition-transform duration-200 sm:h-12 sm:max-w-44"
				>
			</div>

			<div class="flex flex-col items-center gap-1.5">
				<h1
					class="m-0 text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50"
				>
					Iniciar Sesión
				</h1>
				<p
					class="m-0 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"
				>
					Ingresa tus credenciales para acceder al sistema
				</p>
			</div>
		</header>

		<div class="flex flex-col">
			<form
				class="flex flex-col gap-5"
				{...loginUser.preflight(authLoginSchema.body)}
				{...loginUser.enhance(async (f) => {
					try {
						const ok = await f.submit();

						if (ok) {
							const res = f.result;
							if (res && !res.success) {
								notifications.showToastError(res.error);
								return;
							}
							notifications.showToastSuccess("¡Sesión iniciada con éxito!");
							await goto(resolve("dashboard"));
							return;
						}

						console.error("[AUTH LOGIN][PROCESSING ERROR]", { ok });
						notifications.showErrorAlert(
							"Error de Procesamiento",
							"Ocurrió un problema inesperado al procesar el inicio de sesión. Por favor, comuníquese con sistemas.",
						);
					} catch (e) {
						if (isHttpError(e)) {
							console.error("[AUTH LOGIN][HTTP ERROR]", e);
							notifications.showErrorAlert(
								"Servicio No Disponible",
								"No pudimos iniciar sesión en este momento. Por favor, comuníquese con sistemas.",
							);
						} else {
							console.error("[AUTH LOGIN][CONNECTION ERROR]", e);
							notifications.showErrorAlert(
								"Error de Conexión",
								"No se pudo establecer comunicación con el servidor. Si el problema continúa, comuníquese con sistemas.",
							);
						}
					}
				})}
				oninput={() => loginUser.validate()}
				novalidate
			>
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<label
							for="username"
							class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
						>
							Usuario
						</label>
						<div class="relative flex w-full items-center">
							<span
								class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
							>
								<User size={16} />
							</span>
							<input
								{...fieldUsername.as("text")}
								id="username"
								class={[
									"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-11 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
									fieldUsername.issues()?.length &&
										"border-red-500 dark:border-red-400",
								]}
								placeholder="Introduce tu usuario"
								autocomplete="username"
								disabled={submitting}
							>
						</div>
						{#if fieldUsername.issues()?.length}
							<span
								class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
							>
								<CircleAlert size={14} />
								<span>{fieldUsername.issues()?.[0]?.message}</span>
							</span>
						{/if}
					</div>

					<div class="flex flex-col gap-2">
						<label
							for="password"
							class="text-xs font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
						>
							Contraseña
						</label>
						<div class="relative flex w-full items-center">
							<span
								class="pointer-events-none absolute left-4 z-10 flex size-4 items-center justify-center text-zinc-500 transition-colors duration-200 dark:text-zinc-400"
							>
								<Lock size={16} />
							</span>
							<input
								{...fieldPassword.as(showPassword ? "text" : "password")}
								id="password"
								class={[
									"min-h-12 w-full rounded-xl border border-zinc-200 bg-white py-3 pr-11 pl-11 text-sm font-medium text-zinc-900 transition-all duration-200 outline-none placeholder:text-xs placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600/30",
									fieldPassword.issues()?.length &&
										"border-red-500 dark:border-red-400",
								]}
								placeholder="••••••••"
								autocomplete="current-password"
								disabled={submitting}
							>
							<button
								type="button"
								class="absolute right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-zinc-100 p-0 text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
								onclick={() => (showPassword = !showPassword)}
								aria-label={showPassword
									? "Ocultar contraseña"
									: "Mostrar contraseña"}
								disabled={submitting}
							>
								{#if showPassword}
									<EyeOff size={16} />
								{:else}
									<Eye size={16} />
								{/if}
							</button>
						</div>
						{#if fieldPassword.issues()?.length}
							<span
								class="mt-1 inline-flex items-center gap-1.5 p-0 text-xs leading-tight font-medium text-red-600 dark:text-red-400"
							>
								<CircleAlert size={14} />
								<span>{fieldPassword.issues()?.[0]?.message}</span>
							</span>
						{/if}
					</div>
				</div>

				<button
					type="submit"
					disabled={submitting}
					class="flex w-full cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 p-0 text-sm font-bold tracking-wide text-zinc-700 transition-all duration-200 hover:not-disabled:border-zinc-300 hover:not-disabled:bg-zinc-200 hover:not-disabled:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:not-disabled:border-zinc-700 dark:hover:not-disabled:bg-zinc-700 dark:hover:not-disabled:text-zinc-100"
				>
					<span
						class="relative z-10 inline-flex w-full items-center justify-center gap-2 px-4 py-3"
					>
						{#if submitting}
							<LoaderCircle size={18} class="animate-spin" />
							<span>Autenticando...</span>
						{:else}
							<LogIn size={18} />
							<span>Iniciar Sesión</span>
						{/if}
					</span>
				</button>
			</form>
		</div>
	</div>
</main>
