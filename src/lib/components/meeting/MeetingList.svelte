<script lang="ts">
	import type { Meeting } from '$lib/types';
	import { formatDate } from '$lib/utils/date';
	import { Eye, MapPin, Users } from 'lucide-svelte';

	interface Props {
		meetings: Meeting[];
		onview?: (meeting: Meeting) => void;
	}

	let { meetings, onview }: Props = $props();

	const statusColors = {
		scheduled: 'bg-blue-100 text-blue-800',
		ongoing: 'bg-green-100 text-green-800',
		completed: 'bg-gray-100 text-gray-800'
	};

	const statusLabels = {
		scheduled: 'Terjadwal',
		ongoing: 'Berlangsung',
		completed: 'Selesai'
	};
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
	{#if meetings.length === 0}
		<div class="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg shadow">
			<p class="text-sm sm:text-base">Tidak ada data rapat</p>
		</div>
	{:else}
		{#each meetings as meeting (meeting.id)}
			<div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
				<div class="p-4 sm:p-6">
					<div class="flex items-start justify-between mb-4 gap-2">
						<h3 class="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 flex-1">
							{meeting.title}
						</h3>
						<span
							class="px-2 py-1 rounded-full text-xs font-medium {statusColors[
								meeting.status
							]} flex-shrink-0"
						>
							{statusLabels[meeting.status]}
						</span>
					</div>

					<div class="space-y-2 mb-4">
						<div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
							<MapPin class="w-4 h-4 flex-shrink-0" />
							<span class="truncate">{meeting.location}</span>
						</div>
						<div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
							<Users class="w-4 h-4 flex-shrink-0" />
							<span>{meeting.attendees.length} peserta</span>
						</div>
						<div class="text-xs sm:text-sm text-gray-600">
							{formatDate(meeting.date)}
						</div>
					</div>

					<div class="mb-4">
						<p class="text-xs sm:text-sm text-gray-600">
							{meeting.agendaItems.length} agenda
							{#if meeting.agendaItems.some((a) => a.requiresVote)}
								<span class="text-blue-600"
									>• {meeting.agendaItems.filter((a) => a.requiresVote).length} voting</span
								>
							{/if}
						</p>
					</div>

					{#if onview}
						<button
							type="button"
							onclick={() => onview(meeting)}
							class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
						>
							<Eye class="w-4 h-4" />
							Lihat Detail
						</button>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>
