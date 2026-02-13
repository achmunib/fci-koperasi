<script lang="ts">
	import type { Loan } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import { Eye } from 'lucide-svelte';

	interface Props {
		loans: Loan[];
		onview?: (loan: Loan) => void;
	}

	let { loans, onview }: Props = $props();

	const statusColors = {
		active: 'bg-blue-100 text-blue-800',
		completed: 'bg-green-100 text-green-800',
		overdue: 'bg-red-100 text-red-800'
	};

	const statusLabels = {
		active: 'Aktif',
		completed: 'Lunas',
		overdue: 'Terlambat'
	};
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Anggota
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Jumlah Pinjaman
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Bunga
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Tenor
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Tanggal Mulai
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Sisa Pinjaman
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Status
				</th>
				{#if onview}
					<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Aksi
					</th>
				{/if}
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
			{#if loans.length === 0}
				<tr>
					<td colspan={onview ? 8 : 7} class="px-6 py-8 text-center text-gray-500">
						Tidak ada data pinjaman
					</td>
				</tr>
			{:else}
				{#each loans as loan (loan.id)}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">{loan.memberName}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="text-sm font-semibold text-gray-900">{formatIDR(loan.amount)}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="text-sm text-gray-900">{loan.interestRate}%</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="text-sm text-gray-900">{loan.termMonths} bulan</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-500">{formatDate(loan.startDate)}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="text-sm font-semibold text-gray-900">{formatIDR(loan.outstandingBalance)}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {statusColors[loan.status]}">
								{statusLabels[loan.status]}
							</span>
						</td>
						{#if onview}
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									type="button"
									onclick={() => onview(loan)}
									class="text-blue-600 hover:text-blue-900"
									title="Lihat Detail"
								>
									<Eye class="w-4 h-4" />
								</button>
							</td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>
		{#if loans.length > 0}
			<tfoot class="bg-gray-50">
				<tr>
					<td class="px-6 py-4 text-right font-semibold text-gray-900">
						Total:
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-right">
						<div class="text-sm font-bold text-gray-900">
							{formatIDR(loans.reduce((sum, l) => sum + l.amount, 0))}
						</div>
					</td>
					<td colspan="3"></td>
					<td class="px-6 py-4 whitespace-nowrap text-right">
						<div class="text-sm font-bold text-gray-900">
							{formatIDR(loans.reduce((sum, l) => sum + l.outstandingBalance, 0))}
						</div>
					</td>
					<td colspan={onview ? 2 : 1}></td>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
