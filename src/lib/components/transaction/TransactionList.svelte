<script lang="ts">
	import type { Transaction } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import { Eye } from 'lucide-svelte';

	interface Props {
		transactions: Transaction[];
		showRunningTotal?: boolean;
		onview?: (transaction: Transaction) => void;
	}

	let { transactions, showRunningTotal = false, onview }: Props = $props();

	const runningTotal = $derived(() => {
		let total = 0;
		return transactions.map((t) => {
			total += t.total;
			return total;
		});
	});
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Tanggal
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Anggota
				</th>
				<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Produk
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Jumlah
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Harga
				</th>
				<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
					Total
				</th>
				{#if showRunningTotal}
					<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Total Kumulatif
					</th>
				{/if}
				{#if onview}
					<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Aksi
					</th>
				{/if}
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
			{#if transactions.length === 0}
				<tr>
					<td colspan={showRunningTotal ? 8 : 7} class="px-6 py-8 text-center text-gray-500">
						Tidak ada data transaksi
					</td>
				</tr>
			{:else}
				{#each transactions as transaction, index (transaction.id)}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{formatDate(transaction.date)}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">{transaction.memberName}</div>
						</td>
						<td class="px-6 py-4">
							<div class="text-sm text-gray-900">{transaction.productName}</div>
							{#if transaction.notes}
								<div class="text-sm text-gray-500">{transaction.notes}</div>
							{/if}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="text-sm text-gray-900">{transaction.quantity}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="text-sm text-gray-900">{formatIDR(transaction.pricePerUnit)}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="text-sm font-semibold text-gray-900">{formatIDR(transaction.total)}</div>
						</td>
						{#if showRunningTotal}
							<td class="px-6 py-4 whitespace-nowrap text-right">
								<div class="text-sm font-semibold text-blue-600">{formatIDR(runningTotal()[index])}</div>
							</td>
						{/if}
						{#if onview}
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									type="button"
									onclick={() => onview(transaction)}
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
		{#if transactions.length > 0}
			<tfoot class="bg-gray-50">
				<tr>
					<td colspan={showRunningTotal ? 5 : 5} class="px-6 py-4 text-right font-semibold text-gray-900">
						Total:
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-right">
						<div class="text-sm font-bold text-gray-900">
							{formatIDR(transactions.reduce((sum, t) => sum + t.total, 0))}
						</div>
					</td>
					{#if showRunningTotal}
						<td></td>
					{/if}
					{#if onview}
						<td></td>
					{/if}
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
