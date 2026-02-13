<script lang="ts">
	import { Card } from '$lib/components/common';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import { Users, Package, TrendingUp, Wallet, CreditCard, PieChart } from 'lucide-svelte';

	// Mock data - in real app, this would come from API
	const metrics = [
		{
			title: 'Total Anggota',
			value: '156',
			icon: Users,
			color: 'bg-blue-500',
			change: '+12 bulan ini'
		},
		{
			title: 'Total Penjualan',
			value: formatIDR(45750000),
			icon: TrendingUp,
			color: 'bg-green-500',
			change: '+15% dari bulan lalu'
		},
		{
			title: 'Total Simpanan',
			value: formatIDR(125000000),
			icon: Wallet,
			color: 'bg-purple-500',
			change: '+8% dari bulan lalu'
		},
		{
			title: 'Total Pinjaman',
			value: formatIDR(85000000),
			icon: CreditCard,
			color: 'bg-orange-500',
			change: '23 pinjaman aktif'
		}
	];

	const recentTransactions = [
		{
			id: '1',
			memberName: 'Budi Santoso',
			productName: 'Beras Organik',
			quantity: 50,
			total: 2500000,
			date: new Date('2024-02-04')
		},
		{
			id: '2',
			memberName: 'Siti Aminah',
			productName: 'Sayuran Segar',
			quantity: 30,
			total: 450000,
			date: new Date('2024-02-04')
		},
		{
			id: '3',
			memberName: 'Ahmad Yani',
			productName: 'Telur Ayam Kampung',
			quantity: 100,
			total: 1500000,
			date: new Date('2024-02-03')
		},
		{
			id: '4',
			memberName: 'Dewi Lestari',
			productName: 'Madu Murni',
			quantity: 20,
			total: 1000000,
			date: new Date('2024-02-03')
		},
		{
			id: '5',
			memberName: 'Rudi Hartono',
			productName: 'Kopi Arabika',
			quantity: 15,
			total: 750000,
			date: new Date('2024-02-02')
		}
	];
</script>

<svelte:head>
	<title>Dashboard - Koperasi Produsen</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
		<p class="mt-2 text-sm sm:text-base text-gray-600">Ringkasan aktivitas koperasi produsen</p>
	</div>

	<!-- Metrics Grid -->
	<div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
		{#each metrics as metric}
			{@const Icon = metric.icon}
			<Card>
				<div class="flex items-center justify-between gap-2">
					<div class="flex-1 min-w-0">
						<p class="text-xs sm:text-sm font-medium text-gray-600 truncate">{metric.title}</p>
						<p
							class="mt-2 text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold text-gray-900 break-words"
							style="word-break: break-word; overflow-wrap: break-word;"
						>
							{metric.value}
						</p>
						<p class="mt-2 text-xs sm:text-sm text-gray-500 truncate">{metric.change}</p>
					</div>
					<div class="{metric.color} rounded-lg p-2 sm:p-3 flex-shrink-0">
						<Icon class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Recent Transactions -->
	<Card title="Transaksi Terbaru" subtitle="5 transaksi terakhir">
		<div class="overflow-x-auto -mx-4 sm:mx-0">
			<div class="inline-block min-w-full align-middle">
				<table class="min-w-full divide-y divide-gray-200">
					<thead>
						<tr>
							<th
								class="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								Anggota
							</th>
							<th
								class="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								Produk
							</th>
							<th
								class="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								Jumlah
							</th>
							<th
								class="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								Total
							</th>
							<th
								class="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								Tanggal
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each recentTransactions as transaction}
							<tr class="hover:bg-gray-50">
								<td class="whitespace-nowrap px-4 sm:px-6 py-4">
									<div class="text-xs sm:text-sm font-medium text-gray-900">
										{transaction.memberName}
									</div>
								</td>
								<td class="whitespace-nowrap px-4 sm:px-6 py-4">
									<div class="text-xs sm:text-sm text-gray-900">{transaction.productName}</div>
								</td>
								<td class="hidden sm:table-cell whitespace-nowrap px-4 sm:px-6 py-4">
									<div class="text-xs sm:text-sm text-gray-900">{transaction.quantity}</div>
								</td>
								<td class="whitespace-nowrap px-4 sm:px-6 py-4">
									<div class="text-xs sm:text-sm font-medium text-gray-900">
										{formatIDR(transaction.total)}
									</div>
								</td>
								<td class="hidden md:table-cell whitespace-nowrap px-4 sm:px-6 py-4">
									<div class="text-xs sm:text-sm text-gray-500">
										{formatDate(transaction.date)}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		{#snippet actions()}
			<a
				href="/transactions"
				class="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-500"
			>
				Lihat Semua →
			</a>
		{/snippet}
	</Card>

	<!-- Quick Actions -->
	<div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
		<Card title="Anggota Baru">
			<p class="text-xs sm:text-sm text-gray-600">Tambah anggota baru ke koperasi</p>
			<a
				href="/members/new"
				class="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-colors"
			>
				Tambah Anggota
			</a>
		</Card>

		<Card title="Transaksi Baru">
			<p class="text-xs sm:text-sm text-gray-600">Catat transaksi penjualan produk</p>
			<a
				href="/transactions/new"
				class="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-green-700 transition-colors"
			>
				Catat Transaksi
			</a>
		</Card>

		<Card title="Laporan">
			<p class="text-xs sm:text-sm text-gray-600">Lihat laporan keuangan koperasi</p>
			<a
				href="/reports"
				class="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-purple-700 transition-colors"
			>
				Lihat Laporan
			</a>
		</Card>
	</div>
</div>
