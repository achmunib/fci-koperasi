<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { productStore } from '$lib/stores/products';
	import { memberStore } from '$lib/stores/members';
	import { productService, memberService } from '$lib/services';
	import ProductForm from '$lib/components/product/ProductForm.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	let loading = $state(false);
	let error = $state<string | null>(null);
	let loadingMembers = $state(true);

	const members = $derived($memberStore.members);

	onMount(async () => {
		await loadMembers();
	});

	async function loadMembers() {
		loadingMembers = true;
		try {
			const response = await memberService.getMembers();
			if (response.success && response.data) {
				memberStore.setMembers(response.data);
			}
		} catch (err) {
			// Silent fail
		} finally {
			loadingMembers = false;
		}
	}

	async function handleSubmit(data: Partial<Product>) {
		loading = true;
		error = null;

		try {
			const response = await productService.createProduct(data);
			if (response.success && response.data) {
				productStore.addProduct(response.data);
				goto('/products');
			} else {
				error = response.error || 'Gagal menambahkan produk';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat menambahkan produk';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto('/products');
	}
</script>

<div class="space-y-6">
	<div>
		<button
			type="button"
			onclick={() => goto('/products')}
			class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
		>
			<ArrowLeft class="w-4 h-4 mr-2" />
			Kembali ke Daftar Produk
		</button>
		<h1 class="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
		<p class="text-gray-600 mt-1">Lengkapi formulir untuk menambahkan produk baru</p>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		{#if loadingMembers}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else}
			<ProductForm {members} onsubmit={handleSubmit} oncancel={handleCancel} {loading} />
		{/if}
	</div>
</div>
