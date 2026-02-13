<script lang="ts">
	import type { SavingsSummary } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import Card from '$lib/components/common/Card.svelte';
	import { Wallet, TrendingUp, TrendingDown, Users } from 'lucide-svelte';

	interface Props {
		summaries: SavingsSummary[];
		onviewdetail?: (summary: SavingsSummary) => void;
	}

	let { summaries, onviewdetail }: Props = $props();

	const totalSavings = $derived(summaries.reduce((sum, s) => sum + s.currentBalance, 0));
	const totalDeposits = $derived(summaries.reduce((sum, s) => sum + s.totalDeposits, 0));
	const totalWithdrawals = $derived(summaries.reduce((sum, s) => sum + s.totalWithdrawals, 0));
	const totalMembers = $derived(summaries.length);
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Total Simpanan</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(totalSavings)}</p>
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
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(totalDeposits)}</p>
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
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(totalWithdrawals)}</p>
				</div>
				<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
					<TrendingDown class="w-6 h-6 text-red-600" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Anggota Aktif</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{totalMembers}</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<Users class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</Card>
	</div>

	<div class="bg-white rounded-lg shadow">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Simpanan per Anggota</h3>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Anggota
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Saldo Saat Ini
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Total Setoran
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Total Penarikan
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Transaksi Terakhir
						</th>
						{#if onviewdetail}
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Aksi
							</th>
						{/if}
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#if summaries.length === 0}
						<tr>
							<td colspan={onviewdetail ? 6 : 5} class="px-6 py-8 text-center text-gray-500">
								Tidak ada data simpanan
							</td>
						</tr>
					{:else}
						{#each summaries as summary (summary.memberId)}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{summary.memberName}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm font-semibold text-gray-900">{formatIDR(summary.currentBalance)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm text-green-600">{formatIDR(summary.totalDeposits)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm text-red-600">{formatIDR(summary.totalWithdrawals)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-500">{formatDate(summary.lastTransactionDate)}</div>
								</td>
								{#if onviewdetail}
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											type="button"
											onclick={() => onviewdetail(summary)}
											class="text-blue-600 hover:text-blue-900"
										>
											Lihat Detail
										</button>
									</td>
								{/if}
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
