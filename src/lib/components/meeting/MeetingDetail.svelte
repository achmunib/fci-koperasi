<script lang="ts">
	import type { Meeting, Member } from '$lib/types';
	import { formatDate, formatDateTime } from '$lib/utils/date';
	import Card from '$lib/components/common/Card.svelte';
	import { Calendar, MapPin, Users, CheckCircle } from 'lucide-svelte';

	interface Props {
		meeting: Meeting;
		members?: Member[];
	}

	let { meeting, members = [] }: Props = $props();

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

	const attendeeMembers = $derived(
		members.filter((m) => meeting.attendees.includes(m.id))
	);

	const attendancePercentage = $derived(
		members.length > 0 ? Math.round((meeting.attendees.length / members.length) * 100) : 0
	);
</script>

<div class="space-y-6">
	<!-- Meeting Info Card -->
	<Card>
		<div class="p-6">
			<div class="flex items-start justify-between mb-4">
				<h2 class="text-2xl font-bold text-gray-900">{meeting.title}</h2>
				<span class="px-3 py-1 rounded-full text-sm font-medium {statusColors[meeting.status]}">
					{statusLabels[meeting.status]}
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="flex items-center gap-3 text-gray-700">
					<Calendar class="w-5 h-5 text-gray-400" />
					<div>
						<div class="text-sm text-gray-500">Tanggal & Waktu</div>
						<div class="font-medium">{formatDateTime(meeting.date)}</div>
					</div>
				</div>

				<div class="flex items-center gap-3 text-gray-700">
					<MapPin class="w-5 h-5 text-gray-400" />
					<div>
						<div class="text-sm text-gray-500">Lokasi</div>
						<div class="font-medium">{meeting.location}</div>
					</div>
				</div>

				<div class="flex items-center gap-3 text-gray-700">
					<Users class="w-5 h-5 text-gray-400" />
					<div>
						<div class="text-sm text-gray-500">Kehadiran</div>
						<div class="font-medium">
							{meeting.attendees.length} dari {members.length} anggota ({attendancePercentage}%)
						</div>
					</div>
				</div>

				<div class="flex items-center gap-3 text-gray-700">
					<CheckCircle class="w-5 h-5 text-gray-400" />
					<div>
						<div class="text-sm text-gray-500">Agenda</div>
						<div class="font-medium">
							{meeting.agendaItems.length} item
							{#if meeting.agendaItems.some((a) => a.requiresVote)}
								<span class="text-blue-600">
									• {meeting.agendaItems.filter((a) => a.requiresVote).length} voting
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>

	<!-- Agenda Items -->
	<Card title="Agenda Rapat">
		<div class="p-6">
			<div class="space-y-4">
				{#each meeting.agendaItems as item, index (item.id)}
					<div class="border-l-4 {item.requiresVote ? 'border-blue-500' : 'border-gray-300'} pl-4 py-2">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h4 class="font-semibold text-gray-900">
									{index + 1}. {item.title}
									{#if item.requiresVote}
										<span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
											Voting
										</span>
									{/if}
								</h4>
								{#if item.description}
									<p class="text-gray-600 mt-1">{item.description}</p>
								{/if}
							</div>
						</div>

						{#if item.requiresVote && item.voteResults}
							<div class="mt-3 p-3 bg-gray-50 rounded-lg">
								<div class="grid grid-cols-3 gap-3 text-center">
									<div>
										<div class="text-lg font-bold text-green-600">{item.voteResults.approve}</div>
										<div class="text-xs text-gray-600">Setuju</div>
									</div>
									<div>
										<div class="text-lg font-bold text-red-600">{item.voteResults.reject}</div>
										<div class="text-xs text-gray-600">Tolak</div>
									</div>
									<div>
										<div class="text-lg font-bold text-gray-600">{item.voteResults.abstain}</div>
										<div class="text-xs text-gray-600">Abstain</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</Card>

	<!-- Attendance List -->
	{#if attendeeMembers.length > 0}
		<Card title="Daftar Hadir">
			<div class="p-6">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{#each attendeeMembers as member (member.id)}
						<div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<CheckCircle class="w-5 h-5 text-green-600" />
							<div>
								<div class="font-medium text-gray-900">{member.name}</div>
								<div class="text-sm text-gray-500">{member.idNumber}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</Card>
	{/if}
</div>
