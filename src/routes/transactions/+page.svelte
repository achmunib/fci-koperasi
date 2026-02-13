<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { transactionStore, filteredTransactions } from '$lib/stores/transactions';
	import { memberStore } from '$lib/stores/members';
	import { productStore } from '$lib/stores/products';
	import { transactionService, memberService, productService } from '$lib/services';
	import TransactionList from '$lib/components/transaction/TransactionList.svelte';
	import TransactionSummary from '$lib/components/transaction/TransactionSummary.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { Plus, Calendar } from 'lucide-svelte';

	let dateFrom = $state($transactionStore.dateFrom);
	let dateTo = $state($transactionStore.dateTo);
	let memberFilter = $state('all');
	let productFilter = $state('all');
	let showRunningTotal = $state(true);

	const transactions = $derived($filteredTransactions);
	const loading = $derived($transactionStore.loading);
	const error = $derived($transactionStore.error);
	const members = $derived($memberStore.members);
	const products = $derived($productStore.products);

	const memberOptions = $derived([
		{ value: 'all', label: 'Semua Anggota' },
		...members.map((m) => ({ value: m.id, label: m.name }))
	]);

	const productOptions = $derived([
		{ value: 'all', label: 'Semua Produk' },
		...products.map((p) => ({ value: p.id, label: p.name }))
	]);

	onMount(async () => {
		await Promise.all([loadTransactions(), loadMembers(), loadProducts()]);
	});

	async function loadTransactions() {
		transactionStore.setLoading(true);
		transactionStore.setError(null);

		try {
			const response = await transactionService.getTransactions();
			if (response.success && response.data) {
				transactionStore.setTransactions(response.data);
			} else {
				transactionStore.setError(response.error || 'Gagal memuat data transaksi');
			}
		} catch (err) {
			transactionStore.setError('Terjadi kesalahan saat memuat data');
		} finally {
			transactionStore.setLoading(false);
		}
	}

	async function loadMembers() {
		try {
			const response = await memberService.getMembers();
			if (response.success && response.data) {
				memberStore.setMembers(response.data);
			}
		} catch (err) {
			// Silent fail
		}
	}

	async function loadProducts() {
		try {
			const response = await productService.getProducts();
			if (response.success && response.data) {
				productStore.setProducts(response.data);
			}
		} catch (err) {
			// Silent fail
		}
	}

	function handleDateFromChange() {
		transactionStore.setDateFrom(dateFrom);
	}

	function handleDateToChange() {
		transactionStore.setDateTo(dateTo);
	}

	function handleMemberFilter() {
		transactionStore.setMemberFilter(memberFilter);
	}

	function handleProductFilter() {
		transactionStore.setProductFilter(productFilter);
	}

	$effect(() => {
		handleDateFromChange();
	});

	$effect(() => {
		handleDateToChange();
	});

	$effect(() => {
		handleMemberFilter();
	});

	$effect(() => {
		handleProductFilter();
	});

</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Transaksi Penjualan</h1>
			<p class="text-gray-600 mt-1">Kelola dan pantau transaksi penjualan</p>
		</div>
		<Button variant="primary" onclick={() => goto('/transactions/new')}>
			<Plus class="w-4 h-4 mr-2" />
			Tambah Transaksi
		</Button>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	{#if !loading}
		<TransactionSummary {transactions} />
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		<div class="space-y-4 mb-6">
			<div class="flex items-center gap-2 text-gray-700">
				<Calendar class="w-5 h-5" />
				<h3 class="font-semibold">Filter Transaksi</h3>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Input
					label="Dari Tanggal"
					type="date"
					bind:value={dateFrom}
				/>

				<Input
					label="Sampai Tanggal"
					type="date"
					bind:value={dateTo}
				/>

				<Select
					label="Anggota"
					options={memberOptions}
					bind:value={memberFilter}
				/>

				<Select
					label="Produk"
					options={productOptions}
					bind:value={productFilter}
				/>
			</div>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="showRunningTotal"
					bind:checked={showRunningTotal}
					class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
				/>
				<label for="showRunningTotal" class="text-sm text-gray-700">
					Tampilkan Total Kumulatif
				</label>
			</div>
		</div>

		{#if loading}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else}
			<TransactionList {transactions} {showRunningTotal} />
		{/if}
	</div>
</div>
