<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { transactionStore } from '$lib/stores/transactions';
	import { memberStore } from '$lib/stores/members';
	import { productStore } from '$lib/stores/products';
	import { transactionService, memberService, productService } from '$lib/services';
	import TransactionForm from '$lib/components/transaction/TransactionForm.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { Transaction } from '$lib/types';

	let loading = $state(false);
	let error = $state<string | null>(null);
	let loadingData = $state(true);

	const members = $derived($memberStore.members);
	const products = $derived($productStore.products);

	onMount(async () => {
		await Promise.all([loadMembers(), loadProducts()]);
	});

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
		} finally {
			loadingData = false;
		}
	}

	async function handleSubmit(data: Partial<Transaction>) {
		loading = true;
		error = null;

		try {
			const response = await transactionService.createTransaction(data);
			if (response.success && response.data) {
				transactionStore.addTransaction(response.data);
				goto('/transactions');
			} else {
				error = response.error || 'Gagal menambahkan transaksi';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat menambahkan transaksi';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto('/transactions');
	}
</script>

<div class="space-y-6">
	<div>
		<button
			type="button"
			onclick={() => goto('/transactions')}
			class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
		>
			<ArrowLeft class="w-4 h-4 mr-2" />
			Kembali ke Daftar Transaksi
		</button>
		<h1 class="text-2xl font-bold text-gray-900">Tambah Transaksi Baru</h1>
		<p class="text-gray-600 mt-1">Lengkapi formulir untuk mencatat transaksi penjualan</p>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		{#if loadingData}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else}
			<TransactionForm {members} {products} onsubmit={handleSubmit} oncancel={handleCancel} {loading} />
		{/if}
	</div>
</div>
