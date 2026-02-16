<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Input, Alert } from '$lib/components/common';
	import { authStore } from '$lib/stores/auth';
	import { notificationStore } from '$lib/stores/notifications';
	import { validateRequired, validateEmail } from '$lib/utils/validation';

	let username = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let errors = $state<{ username?: string; password?: string }>({});

	function validateForm(): boolean {
		const newErrors: { username?: string; password?: string } = {};

		if (!validateRequired(username)) {
			newErrors.username = 'Username harus diisi';
		}

		if (!validateRequired(password)) {
			newErrors.password = 'Password harus diisi';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit() {
		error = '';

		if (!validateForm()) {
			return;
		}

		loading = true;

		try {
			await authStore.login(username, password);
			
			// Set cookie for server-side auth check
			const token = authStore.getToken();
			if (token) {
				document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24 hours
			}
			
			// Show success notification
			notificationStore.success('Login berhasil! Selamat datang.');
			
			// Redirect to dashboard on success
			goto('/');
		} catch (err) {
			if (err instanceof Error) {
				error = err.message;
				notificationStore.error(err.message);
			} else {
				error = 'Terjadi kesalahan saat login';
				notificationStore.error('Terjadi kesalahan saat login');
			}
		} finally {
			loading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<svelte:head>
	<title>Login - Koperasi Produsen</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				Koperasi Produsen
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">Masuk ke akun Anda</p>
		</div>

		<div class="mt-8 space-y-6 rounded-lg bg-white px-8 py-8 shadow">
			{#if error}
				<Alert type="error" message={error} dismissible ondismiss={() => (error = '')} />
			{/if}

			<div class="space-y-4">
				<Input
					label="Username"
					bind:value={username}
					error={errors.username}
					placeholder="Masukkan username"
					required
					disabled={loading}
					onkeydown={handleKeydown}
				/>

				<Input
					type="password"
					label="Password"
					bind:value={password}
					error={errors.password}
					placeholder="Masukkan password"
					required
					disabled={loading}
					onkeydown={handleKeydown}
				/>
			</div>

			<div>
				<Button
					variant="primary"
					class="w-full"
					{loading}
					disabled={loading}
					onclick={handleSubmit}
				>
					{loading ? 'Memproses...' : 'Masuk'}
				</Button>
			</div>

			<div class="text-center text-sm text-gray-600">
				<p>Demo credentials:</p>
				<p class="mt-1 font-mono text-xs">
					Admin: admin / admin123<br />
					Member: member / member123
				</p>
			</div>
		</div>
	</div>
</div>
