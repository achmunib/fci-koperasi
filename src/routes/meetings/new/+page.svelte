<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Meeting } from '$lib/types';
	import { meetingService } from '$lib/services';
	import { MeetingForm } from '$lib/components/meeting';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	async function handleSubmit(data: Partial<Meeting>) {
		try {
			loading = true;
			error = null;
			success = false;

			await meetingService.createMeeting({
				title: data.title!,
				date: data.date!,
				location: data.location!,
				agendaItems: data.agendaItems!.map((item) => ({
					title: item.title,
					description: item.description,
					requiresVote: item.requiresVote
				}))
			});

			success = true;
			setTimeout(() => {
				goto('/meetings');
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal membuat rapat';
			console.error('Error creating meeting:', err);
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto('/meetings');
	}
</script>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<button
			type="button"
			onclick={handleCancel}
			class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<ArrowLeft class="w-6 h-6 text-gray-600" />
		</button>
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Buat Rapat Baru</h1>
			<p class="text-gray-600 mt-1">Isi informasi rapat dan agenda</p>
		</div>
	</div>

	<!-- Success Alert -->
	{#if success}
		<Alert type="success" message="Rapat berhasil dibuat! Mengalihkan..." />
	{/if}

	<!-- Error Alert -->
	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<!-- Form -->
	<div class="bg-white rounded-lg shadow p-6">
		<MeetingForm onsubmit={handleSubmit} oncancel={handleCancel} {loading} />
	</div>
</div>
