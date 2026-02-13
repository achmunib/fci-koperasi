<script lang="ts">
	import type { PersonalReport } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import Card from '$lib/components/common/Card.svelte';
	import { TrendingUp, Wallet, CreditCard, Gift } from 'lucide-svelte';

	interface Props {
		report: PersonalReport;
	}

	let { report }: Props = $props();
</script>

<div class="space-y-6">
	<!-- Summary Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-blue-100 rounded-lg">
						<TrendingUp class="w-6 h-6 text-blue-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Total Penjualan</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.totalSales)}</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-green-100 rounded-lg">
						<Wallet class="w-6 h-6 text-green-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Saldo Simpanan</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.currentSavingsBalance)}</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-red-100 rounded-lg">
						<CreditCard class="w-6 h-6 text-red-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Pinjaman Aktif</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.totalLoansOutstanding)}</p>
			</div>
		</Card>

		<Card>
			<div class="p-6">
				<div class="flex items-center justify-between mb-2">
					<div class="p-2 bg-purple-100 rounded-lg">
						<Gift class="w-6 h-6 text-purple-600" />
					</div>
				</div>
				<h3 class="text-sm font-medium text-gray-600">Total SHU Diterima</h3>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(report.totalSHUReceived)}</p>
			</div>
		</Card>
	</div>

	<!-- Member Info -->
	<Card title="Informasi Anggota">
		<div class="p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-gray-600">Nama</p>
					<p class="font-medium text-gray-900">{report.member.name}</p>
				</div>
				<div>
					<p class="text-sm text-gray-600">Nomor Anggota</p>
					<p class="font-medium text-gray-900">{report.member.idNumber}</p>
				</div>
				<div>
					<p class="text-sm text-gray-600">Email</p>
					<p class="font-medium text-gray-900">{report.member.email}</p>
				</div>
				<div>
					<p class="text-sm text-gray-600">Tanggal Bergabung</p>
					<p class="font-medium text-gray-900">{formatDate(report.member.joinDate)}</p>
				</div>
			</div>
		</div>
	</Card>

	<!-- Recent Transactions -->
	<Card title="Transaksi Terbaru">
		<div class="p-6">
			{#if report.transactions.length === 0}
				<p class="text-center text-gray-500 py-4">Tidak ada transaksi</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each report.transactions.slice(0, 10) as transaction (transaction.id)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatDate(transaction.date)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{transaction.productName}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{transaction.quantity} {transaction.pricePerUnit ? 'unit' : ''}
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

	<!-- Savings Transactions -->
	<Card title="Riwayat Simpanan">
		<div class="p-6">
			{#if report.savingsTransactions.length === 0}
				<p class="text-center text-gray-500 py-4">Tidak ada transaksi simpanan</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each report.savingsTransactions.slice(0, 10) as transaction (transaction.id)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatDate(transaction.date)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm">
										<span class="px-2 py-1 rounded-full text-xs font-medium {transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
											{transaction.type === 'deposit' ? 'Setor' : 'Tarik'}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
										{formatIDR(transaction.amount)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
										{formatIDR(transaction.balance)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</Card>

	<!-- Active Loans -->
	<Card title="Pinjaman Aktif">
		<div class="p-6">
			{#if report.loans.length === 0}
				<p class="text-center text-gray-500 py-4">Tidak ada pinjaman aktif</p>
			{:else}
				<div class="space-y-4">
					{#each report.loans as loan (loan.id)}
						<div class="border rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-medium text-gray-900">Pinjaman #{loan.id}</h4>
								<span class="px-2 py-1 rounded-full text-xs font-medium {loan.status === 'active' ? 'bg-green-100 text-green-800' : loan.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
									{loan.status === 'active' ? 'Aktif' : loan.status === 'overdue' ? 'Terlambat' : 'Lunas'}
								</span>
							</div>
							<div class="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p class="text-gray-600">Jumlah Pinjaman</p>
									<p class="font-medium text-gray-900">{formatIDR(loan.amount)}</p>
								</div>
								<div>
									<p class="text-gray-600">Sisa Pinjaman</p>
									<p class="font-medium text-gray-900">{formatIDR(loan.outstandingBalance)}</p>
								</div>
								<div>
									<p class="text-gray-600">Bunga</p>
									<p class="font-medium text-gray-900">{loan.interestRate}%</p>
								</div>
								<div>
									<p class="text-gray-600">Tenor</p>
									<p class="font-medium text-gray-900">{loan.termMonths} bulan</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</Card>

	<!-- SHU History -->
	<Card title="Riwayat SHU">
		<div class="p-6">
			{#if report.shuDistributions.length === 0}
				<p class="text-center text-gray-500 py-4">Belum ada distribusi SHU</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kontribusi Transaksi</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kontribusi Simpanan</th>
								<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total SHU</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each report.shuDistributions as shu (shu.distributionId)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{shu.distributionId}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
										{formatIDR(shu.transactionContribution)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
										{formatIDR(shu.savingsContribution)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
										{formatIDR(shu.totalShare)}
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
