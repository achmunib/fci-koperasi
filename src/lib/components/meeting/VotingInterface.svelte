<script lang="ts">
	import type { AgendaItem, Vote } from '$lib/types';
	import Button from '$lib/components/common/Button.svelte';
	import { Check, X, Minus } from 'lucide-svelte';

	interface Props {
		meetingId: string;
		agendaItems: AgendaItem[];
		currentUserId: string;
		onvote: (vote: Vote) => void | Promise<void>;
		disabled?: boolean;
	}

	let { meetingId, agendaItems, currentUserId, onvote, disabled = false }: Props = $props();

	const votingItems = $derived(agendaItems.filter((item) => item.requiresVote));

	function hasVoted(agendaItem: AgendaItem): boolean {
		return agendaItem.voteResults?.voters.includes(currentUserId) || false;
	}

	function getUserVote(agendaItem: AgendaItem): 'approve' | 'reject' | 'abstain' | null {
		if (!hasVoted(agendaItem)) return null;
		// In a real app, we'd fetch the user's specific vote from the API
		// For now, we just know they voted
		return null;
	}

	async function handleVote(agendaItemId: string, choice: 'approve' | 'reject' | 'abstain') {
		const vote: Vote = {
			meetingId,
			agendaItemId,
			memberId: currentUserId,
			choice,
			timestamp: new Date()
		};
		await onvote(vote);
	}
</script>

<div class="space-y-6">
	{#if votingItems.length === 0}
		<div class="text-center py-8 text-gray-500">
			Tidak ada agenda yang memerlukan voting
		</div>
	{:else}
		{#each votingItems as item (item.id)}
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
				{#if item.description}
					<p class="text-gray-600 mb-4">{item.description}</p>
				{/if}

				{#if item.voteResults}
					<div class="mb-4 p-4 bg-gray-50 rounded-lg">
						<h4 class="font-medium text-gray-900 mb-3">Hasil Voting</h4>
						<div class="grid grid-cols-3 gap-4">
							<div class="text-center">
								<div class="text-2xl font-bold text-green-600">{item.voteResults.approve}</div>
								<div class="text-sm text-gray-600">Setuju</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-red-600">{item.voteResults.reject}</div>
								<div class="text-sm text-gray-600">Tolak</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-gray-600">{item.voteResults.abstain}</div>
								<div class="text-sm text-gray-600">Abstain</div>
							</div>
						</div>
						<div class="mt-3 text-sm text-gray-600 text-center">
							Total: {item.voteResults.approve + item.voteResults.reject + item.voteResults.abstain} suara
						</div>
					</div>
				{/if}

				{#if hasVoted(item)}
					<div class="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
						<Check class="w-5 h-5" />
						<span class="font-medium">Anda sudah memberikan suara</span>
					</div>
				{:else if !disabled}
					<div class="flex gap-3">
						<Button
							variant="primary"
							onclick={() => handleVote(item.id, 'approve')}
							class="flex-1"
						>
							<Check class="w-4 h-4 mr-2" />
							Setuju
						</Button>
						<Button
							variant="danger"
							onclick={() => handleVote(item.id, 'reject')}
							class="flex-1"
						>
							<X class="w-4 h-4 mr-2" />
							Tolak
						</Button>
						<Button
							variant="secondary"
							onclick={() => handleVote(item.id, 'abstain')}
							class="flex-1"
						>
							<Minus class="w-4 h-4 mr-2" />
							Abstain
						</Button>
					</div>
				{:else}
					<div class="text-center text-gray-500 py-2">
						Voting tidak tersedia
					</div>
				{/if}
			</div>
		{/each}
	{/if}
</div>
