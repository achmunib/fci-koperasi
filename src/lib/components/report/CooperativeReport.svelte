<script lang="ts">
	import type { CooperativeReport } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import Card from '$lib/components/common/Card.svelte';
	import { Users, TrendingUp, Wallet, CreditCard, Gift, Award } from 'lucide-svelte';

	interface Props {
		report: CooperativeReport;
	}

	let { report }: Props = $props();
</script>

<div class="space-y-6">
	<!-- Summary Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-blue-100 rounded-lg">
						<Users class="w-6 h-6 text-blue-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Total Anggota</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{report.totalMembers}</p>
				<p class="text-sm text-gray-500 mt-1">{report.activeMembers} aktif</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-green-100 rounded-lg">
						<TrendingUp class="w-6 h-6 text-green-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Total Penjualan</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.totalSales)}</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-purple-100 rounded-lg">
						<Wallet class="w-6 h-6 text-purple-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Total Simpanan</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.totalSavings)}</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-red-100 rounded-lg">
						<CreditCard class="w-6 h-6 text-red-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Total Pinjaman</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.totalLoansOutstanding)}</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-yellow-100 rounded-lg">
						<Gift class="w-6 h-6 text-yellow-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Total SHU Dibagikan</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.totalSHUDistributed)}</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-indigo-100 rounded-lg">
						<Award class="w-6 h-6 text-indigo-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Transaksi Terbaru</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{report.recentTransactions.length}</p>
			</div>
		</Card>
	</div>

	<!-- Top Producers -->
	<Card title="Produsen Teratas">
		<div class="p-6">
			{#if report.topProducers.length === 0}
				<p class="text-center text-gray-500 py-4">Belum ada data produsen</p>
			{:else}
				<div class="space-y-4">
					{#each report.topProducers as producer, index (producer.member.id)}
						<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
							<div class="flex items-center gap-4">
								<div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
									{index + 1}
								</div>
								<div>
									<p class="font-medium text-gray-900">{producer.member.name}</p>
									<p class="text-sm text-gray-500">{producer.member.idNumber}</p>
								</div>
							</div>
							<div class="text-right">
								<p class="font-bold text-gray-900">{formatIDR(producer.totalSales)}</p>
								<p class="text-sm text-gray-500">Total Penjualan</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</Card>

	<!-- Recent Transactions -->
	<Card title="Transaksi Terbaru">
		<div class="p-6">
			{#if report.recentTransactions.length === 0}
				<p class="text-center text-gray-500 py-4">Tidak ada transaksi</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anggota</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each report.recentTransactions as transaction (transaction.id)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatDate(transaction.date)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{transaction.memberName}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{transaction.productName}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{transaction.quantity}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
										{formatIDR(transaction.total)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</Card>
</div>
