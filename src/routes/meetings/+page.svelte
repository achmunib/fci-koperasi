<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Meeting, MeetingFilters } from '$lib/types';
	import { meetingService } from '$lib/services';
	import { MeetingList } from '$lib/components/meeting';
	import Button from '$lib/components/common/Button.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { Plus } from 'lucide-svelte';

	let meetings = $state<Meeting[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let filters = $state<MeetingFilters>({
		status: undefined
	});
	
	// Initialize filter value for Select component (can't bind to undefined with fallback)
	let statusFilter = $state<string>('');

	const statusOptions = [
		{ value: '', label: 'Semua Status' },
		{ value: 'scheduled', label: 'Terjadwal' },
		{ value: 'ongoing', label: 'Berlangsung' },
		{ value: 'completed', label: 'Selesai' }
	];

	async function loadMeetings() {
		try {
			loading = true;
			error = null;
			const filterParams: MeetingFilters = {};
			if (statusFilter && statusFilter !== '') {
				filterParams.status = statusFilter as 'scheduled' | 'ongoing' | 'completed';
			}
			meetings = await meetingService.getMeetings(filterParams);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data rapat';
			console.error('Error loading meetings:', err);
		} finally {
			loading = false;
		}
	}

	function handleViewMeeting(meeting: Meeting) {
		goto(`/meetings/${meeting.id}`);
	}

	function handleCreateMeeting() {
		goto('/meetings/new');
	}

	onMount(() => {
		loadMeetings();
	});
</script>

<svelte:head>
	<title>Manajemen Rapat - Koperasi Produsen</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Rapat</h1>
			<p class="text-sm sm:text-base text-gray-600 mt-1">Kelola rapat dan voting koperasi</p>
		</div>
		<Button variant="primary" onclick={handleCreateMeeting}>
			<Plus class="w-4 h-4 mr-2" />
			<span class="hidden sm:inline">Buat Rapat Baru</span>
			<span class="sm:hidden">Buat Rapat</span>
		</Button>
	</div>

	<!-- Filters -->
	<div class="bg-white rounded-lg shadow p-4 sm:p-6">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<Select
				label="Status"
				options={statusOptions}
				bind:value={statusFilter}
				onchange={loadMeetings}
			/>
		</div>
	</div>

	<!-- Error Alert -->
	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<!-- Loading State -->
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else}
		<!-- Meeting List -->
		<MeetingList {meetings} onview={handleViewMeeting} />
	{/if}
</div>
