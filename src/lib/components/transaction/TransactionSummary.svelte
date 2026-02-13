<script lang="ts">
	import type { Transaction } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import Card from '$lib/components/common/Card.svelte';
	import { ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-svelte';

	interface Props {
		transactions: Transaction[];
	}

	let { transactions }: Props = $props();

	const totalTransactions = $derived(transactions.length);
	const totalAmount = $derived(transactions.reduce((sum, t) => sum + t.total, 0));
	const averageAmount = $derived(totalTransactions > 0 ? totalAmount / totalTransactions : 0);
	const totalQuantity = $derived(transactions.reduce((sum, t) => sum + t.quantity, 0));
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
	<Card>
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-600">Total Transaksi</p>
				<p class="text-2xl font-bold text-gray-900 mt-1">{totalTransactions}</p>
			</div>
			<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
				<ShoppingCart class="w-6 h-6 text-blue-600" />
			</div>
		</div>
	</Card>

	<Card>
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-600">Total Nilai</p>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(totalAmount)}</p>
			</div>
			<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
				<DollarSign class="w-6 h-6 text-green-600" />
			</div>
		</div>
	</Card>

	<Card>
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-600">Rata-rata Nilai</p>
				<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(averageAmount)}</p>
			</div>
			<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
				<TrendingUp class="w-6 h-6 text-purple-600" />
			</div>
		</div>
	</Card>

	<Card>
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-gray-600">Total Kuantitas</p>
				<p class="text-2xl font-bold text-gray-900 mt-1">{totalQuantity}</p>
			</div>
			<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
				<Package class="w-6 h-6 text-orange-600" />
			</div>
		</div>
	</Card>
</div>
