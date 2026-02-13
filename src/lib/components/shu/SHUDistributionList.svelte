<script lang="ts">
	import type { SHUMemberShare } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import Button from '$lib/components/common/Button.svelte';
	import { Check } from 'lucide-svelte';

	interface Props {
		shares: SHUMemberShare[];
		totalProfit: number;
		period: string;
		onApprove?: () => void | Promise<void>;
		approving?: boolean;
		isDistributed?: boolean;
	}

	let { shares, totalProfit, period, onApprove, approving = false, isDistributed = false }: Props = $props();

	const totalDistributed = $derived(shares.reduce((sum, s) => sum + s.totalShare, 0));
</script>

<div class="space-y-6">
	<div class="bg-white rounded-lg shadow p-6">
		<div class="flex items-center justify-between mb-4">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">Distribusi SHU Periode {period}</h3>
				<p class="text-sm text-gray-600 mt-1">
					Total Keuntungan: <span class="font-semibold">{formatIDR(totalProfit)}</span>
				</p>
			</div>
			{#if onApprove && !isDistributed}
				<Button variant="primary" onclick={onApprove} loading={approving}>
					<Check class="w-4 h-4 mr-2" />
					Setujui & Distribusikan
				</Button>
			{:else if isDistributed}
				<span class="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
					Sudah Didistribusikan
				</span>
			{/if}
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			<div class="bg-blue-50 rounded-lg p-4">
				<p class="text-sm text-blue-700">Total Anggota</p>
				<p class="text-2xl font-bold text-blue-900">{shares.length}</p>
			</div>
			<div class="bg-green-50 rounded-lg p-4">
				<p class="text-sm text-green-700">Total Didistribusikan</p>
				<p class="text-2xl font-bold text-green-900">{formatIDR(totalDistributed)}</p>
			</div>
			<div class="bg-purple-50 rounded-lg p-4">
				<p class="text-sm text-purple-700">Rata-rata per Anggota</p>
				<p class="text-2xl font-bold text-purple-900">
					{formatIDR(shares.length > 0 ? totalDistributed / shares.length : 0)}
				</p>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow overflow-hidden">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Anggota
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Kontribusi Transaksi
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Kontribusi Simpanan
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Persentase
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Bagian SHU
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#if shares.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-8 text-center text-gray-500">
								Tidak ada data distribusi
							</td>
						</tr>
					{:else}
						{#each shares as share (share.memberId)}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{share.memberName}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm text-gray-900">{formatIDR(share.transactionContribution)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm text-gray-900">{formatIDR(share.savingsContribution)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm font-semibold text-gray-900">{share.percentage.toFixed(2)}%</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm font-bold text-green-600">{formatIDR(share.totalShare)}</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
				{#if shares.length > 0}
					<tfoot class="bg-gray-50">
						<tr>
							<td class="px-6 py-4 text-right font-semibold text-gray-900" colspan="3">
								Total:
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right">
								<div class="text-sm font-bold text-gray-900">100%</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right">
								<div class="text-sm font-bold text-green-600">{formatIDR(totalDistributed)}</div>
							</td>
						</tr>
					</tfoot>
				{/if}
			</table>
		</div>
	</div>
</div>
