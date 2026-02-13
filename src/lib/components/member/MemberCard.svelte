<script lang="ts">
	import type { Member } from '$lib/types';
	import { formatDate } from '$lib/utils/date';
	import { User, Mail, Phone, MapPin, Calendar } from 'lucide-svelte';
	import Card from '$lib/components/common/Card.svelte';

	interface Props {
		member: Member;
		onclick?: () => void;
	}

	let { member, onclick }: Props = $props();

	const statusColors = {
		active: 'bg-green-100 text-green-800',
		inactive: 'bg-gray-100 text-gray-800',
		suspended: 'bg-red-100 text-red-800'
	};

	const statusLabels = {
		active: 'Aktif',
		inactive: 'Tidak Aktif',
		suspended: 'Ditangguhkan'
	};

</script>

<Card>
	<button
		type="button"
		onclick={onclick}
		class="w-full text-left hover:bg-gray-50 transition-colors p-4 rounded-lg"
	>
		<div class="flex items-start justify-between mb-3">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
					<User class="w-6 h-6 text-blue-600" />
				</div>
				<div>
					<h3 class="font-semibold text-lg text-gray-900">{member.name}</h3>
					<p class="text-sm text-gray-500">ID: {member.idNumber}</p>
				</div>
			</div>
			<span class="px-3 py-1 rounded-full text-xs font-medium {statusColors[member.status]}">
				{statusLabels[member.status]}
			</span>
		</div>

		<div class="space-y-2 text-sm text-gray-600">
			<div class="flex items-center gap-2">
				<Mail class="w-4 h-4" />
				<span>{member.email}</span>
			</div>
			<div class="flex items-center gap-2">
				<Phone class="w-4 h-4" />
				<span>{member.phone}</span>
			</div>
			<div class="flex items-center gap-2">
				<MapPin class="w-4 h-4" />
				<span class="line-clamp-1">{member.address}</span>
			</div>
			<div class="flex items-center gap-2">
				<Calendar class="w-4 h-4" />
				<span>Bergabung: {formatDate(member.joinDate)}</span>
			</div>
		</div>
	</button>
</Card>
