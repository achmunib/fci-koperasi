<script lang="ts">
	import type { Loan, LoanPayment } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import Card from '$lib/components/common/Card.svelte';
	import { Wallet, Calendar, Percent, TrendingDown } from 'lucide-svelte';

	interface Props {
		loan: Loan;
		payments: LoanPayment[];
	}

	let { loan, payments }: Props = $props();

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

	const totalPaid = $derived(payments.reduce((sum, p) => sum + p.amount, 0));
	const progressPercentage = $derived((totalPaid / loan.amount) * 100);
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Jumlah Pinjaman</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(loan.amount)}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Wallet class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Sisa Pinjaman</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(loan.outstandingBalance)}</p>
				</div>
				<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
					<TrendingDown class="w-6 h-6 text-red-600" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Bunga</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{loan.interestRate}%</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<Percent class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</Card>

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Tenor</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{loan.termMonths} Bulan</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<Calendar class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</Card>
	</div>

	<div class="bg-white rounded-lg shadow p-6">
		<div class="mb-4">
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium text-gray-700">Progress Pembayaran</span>
				<span class="text-sm font-semibold text-gray-900">{progressPercentage.toFixed(1)}%</span>
			</div>
			<div class="w-full bg-gray-200 rounded-full h-3">
				<div
					class="bg-blue-600 h-3 rounded-full transition-all"
					style="width: {progressPercentage}%"
				></div>
			</div>
			<div class="flex justify-between mt-2 text-sm text-gray-600">
				<span>Terbayar: {formatIDR(totalPaid)}</span>
				<span>Status: <span class="px-2 py-1 rounded-full text-xs font-medium {statusColors[loan.status]}">{statusLabels[loan.status]}</span></span>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Riwayat Pembayaran</h3>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Tanggal
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Jumlah
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Pokok
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Bunga
						</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Sisa
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Catatan
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#if payments.length === 0}
						<tr>
							<td colspan="6" class="px-6 py-8 text-center text-gray-500">
								Belum ada pembayaran
							</td>
						</tr>
					{:else}
						{#each payments as payment (payment.id)}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{formatDate(payment.date)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm font-semibold text-gray-900">{formatIDR(payment.amount)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm text-gray-900">{formatIDR(payment.principalPaid)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm text-gray-900">{formatIDR(payment.interestPaid)}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right">
									<div class="text-sm font-semibold text-gray-900">{formatIDR(payment.remainingBalance)}</div>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm text-gray-500">{payment.notes || '-'}</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
