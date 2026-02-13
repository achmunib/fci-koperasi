<script lang="ts">
	import type { SavingsTransaction, SavingsSummary } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import Card from '$lib/components/common/Card.svelte';
	import { Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-svelte';

	interface Props {
		summary: SavingsSummary;
		transactions: SavingsTransaction[];
	}

	let { summary, transactions }: Props = $props();
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Saldo Saat Ini</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(summary.currentBalance)}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Wallet class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Total Setoran</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(summary.totalDeposits)}</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<TrendingUp class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Total Penarikan</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(summary.totalWithdrawals)}</p>
				</div>
				<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
					<TrendingDown class="w-6 h-6 text-red-600" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Transaksi Terakhir</p>
					<p class="text-lg font-bold text-gray-900 mt-1">{formatDate(summary.lastTransactionDate)}</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<Calendar class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</Card>
	</div>

	<div class="bg-white rounded-lg shadow">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Riwayat Transaksi</h3>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Tanggal
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Jenis
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Jumlah
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Saldo
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Catatan
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#if transactions.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-8 text-center text-gray-500">
								Tidak ada riwayat transaksi
							</td>
						</tr>
					{:else}
						{#each transactions as transaction (transaction.id)}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{formatDate(transaction.date)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if transaction.type === 'deposit'}
										<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
											Setoran
										</span>
									{:else}
										<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
											Penarikan
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm font-semibold {transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}">
										{transaction.type === 'deposit' ? '+' : '-'}{formatIDR(transaction.amount)}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm font-semibold text-gray-900">{formatIDR(transaction.balance)}</div>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm text-gray-500">{transaction.notes || '-'}</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
