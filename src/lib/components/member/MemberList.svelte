<script lang="ts">
	import type { Member } from '$lib/types';
	import { formatDate } from '$lib/utils/date';
	import { Edit, Trash2, Eye } from 'lucide-svelte';
	import Button from '$lib/components/common/Button.svelte';

	interface Props {
		members: Member[];
		onview?: (member: Member) => void;
		onedit?: (member: Member) => void;
		ondelete?: (member: Member) => void;
	}

	let { members, onview, onedit, ondelete }: Props = $props();

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

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Nama
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Nomor ID
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Email
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Telepon
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Tanggal Bergabung
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Status
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Aksi
				</th>
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
			{#if members.length === 0}
				<tr>
					<td colspan="7" class="px-6 py-8 text-center text-gray-500">
						Tidak ada data anggota
					</td>
				</tr>
			{:else}
				{#each members as member (member.id)}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">{member.name}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{member.idNumber}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{member.email}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{member.phone}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{formatDate(member.joinDate)}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {statusColors[member.status]}">
								{statusLabels[member.status]}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<div class="flex gap-2 justify-end">
								{#if onview}
									<button
										type="button"
										onclick={() => onview(member)}
										class="text-blue-600 hover:text-blue-900"
										title="Lihat Detail"
									>
										<Eye class="w-4 h-4" />
									</button>
								{/if}
								{#if onedit}
									<button
										type="button"
										onclick={() => onedit(member)}
										class="text-green-600 hover:text-green-900"
										title="Edit"
									>
										<Edit class="w-4 h-4" />
									</button>
								{/if}
								{#if ondelete}
									<button
										type="button"
										onclick={() => ondelete(member)}
										class="text-red-600 hover:text-red-900"
										title="Hapus"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
