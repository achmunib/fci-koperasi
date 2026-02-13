<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Meeting, Member, Vote } from '$lib/types';
	import { meetingService, memberService } from '$lib/services';
	import { authStore } from '$lib/stores/auth';
	import { MeetingDetail, VotingInterface } from '$lib/components/meeting';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft, Edit, CheckCircle } from 'lucide-svelte';

	const meetingId = $derived($page.params.id);
	const currentUser = $derived($authStore.user);

	let meeting = $state<Meeting | null>(null);
	let members = $state<Member[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let voteSuccess = $state(false);
	let voteError = $state<string | null>(null);

	async function loadData() {
		try {
			loading = true;
			error = null;
			const [meetingData, membersData] = await Promise.all([
				meetingService.getMeeting(meetingId),
				memberService.getMembers({ status: 'active' })
			]);
			meeting = meetingData;
			members = membersData;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data rapat';
			console.error('Error loading meeting:', err);
		} finally {
			loading = false;
		}
	}

	async function handleVote(vote: Vote) {
		try {
			voteError = null;
			voteSuccess = false;
			await meetingService.submitVote(vote);
			voteSuccess = true;
			// Reload meeting to get updated vote results
			await loadData();
			setTimeout(() => {
				voteSuccess = false;
			}, 3000);
		} catch (err) {
			voteError = err instanceof Error ? err.message : 'Gagal menyimpan suara';
			console.error('Error submitting vote:', err);
		}
	}

	async function handleCloseMeeting() {
		if (!meeting) return;
		if (!confirm('Apakah Anda yakin ingin menutup rapat ini? Voting tidak dapat dilakukan setelah rapat ditutup.')) {
			return;
		}
		try {
			await meetingService.closeMeeting(meeting.id);
			await loadData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal menutup rapat';
			console.error('Error closing meeting:', err);
		}
	}

	function handleBack() {
		goto('/meetings');
	}

	function handleEdit() {
		if (meeting) {
			goto(`/meetings/${meeting.id}/edit`);
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<div class="max-w-6xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<button
				type="button"
				onclick={handleBack}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
			>
				<ArrowLeft class="w-6 h-6 text-gray-600" />
			</button>
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Detail Rapat</h1>
				<p class="text-gray-600 mt-1">Informasi lengkap dan voting</p>
			</div>
		</div>
		{#if meeting && currentUser?.role === 'admin'}
			<div class="flex gap-3">
				{#if meeting.status !== 'completed'}
					<Button variant="secondary" onclick={handleEdit}>
						<Edit class="w-4 h-4 mr-2" />
						Edit
					</Button>
					<Button variant="primary" onclick={handleCloseMeeting}>
						<CheckCircle class="w-4 h-4 mr-2" />
						Tutup Rapat
					</Button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Vote Success Alert -->
	{#if voteSuccess}
		<Alert type="success" message="Suara Anda berhasil disimpan!" />
	{/if}

	<!-- Vote Error Alert -->
	{#if voteError}
		<Alert type="error" message={voteError} />
	{/if}

	<!-- Error Alert -->
	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<!-- Loading State -->
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else if meeting}
		<!-- Meeting Detail -->
		<MeetingDetail {meeting} {members} />

		<!-- Voting Interface -->
		{#if meeting.agendaItems.some((item) => item.requiresVote)}
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-bold text-gray-900 mb-6">Voting</h2>
				<VotingInterface
					meetingId={meeting.id}
					agendaItems={meeting.agendaItems}
					currentUserId={currentUser?.memberId || currentUser?.id || ''}
					onvote={handleVote}
					disabled={meeting.status === 'completed'}
				/>
			</div>
		{/if}
	{/if}
</div>
