<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { productStore } from '$lib/stores/products';
	import { memberStore } from '$lib/stores/members';
	import { productService, memberService } from '$lib/services';
	import ProductForm from '$lib/components/product/ProductForm.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	const productId = $derived($page.params.id);

	let product = $state<Product | null>(null);
	let loading = $state(true);
	let saving = $state(false);
	let error = $state<string | null>(null);

	const members = $derived($memberStore.members);

	onMount(async () => {
		await Promise.all([loadProduct(), loadMembers()]);
	});

	async function loadProduct() {
		loading = true;
		error = null;

		try {
			const response = await productService.getProduct(productId);
			if (response.success && response.data) {
				product = response.data;
			} else {
				error = response.error || 'Gagal memuat data produk';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat memuat data';
		} finally {
			loading = false;
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

	async function handleSubmit(data: Partial<Product>) {
		saving = true;
		error = null;

		try {
			const response = await productService.updateProduct(productId, data);
			if (response.success && response.data) {
				productStore.updateProduct(productId, response.data);
				goto(`/products/${productId}`);
			} else {
				error = response.error || 'Gagal memperbarui produk';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat memperbarui produk';
		} finally {
			saving = false;
		}
	}

	function handleCancel() {
		goto(`/products/${productId}`);
	}
</script>

<div class="space-y-6">
	<div>
		<button
			type="button"
			onclick={() => goto(`/products/${productId}`)}
			class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
		>
			<ArrowLeft class="w-4 h-4 mr-2" />
			Kembali ke Detail Produk
		</button>
		<h1 class="text-2xl font-bold text-gray-900">Edit Produk</h1>
		<p class="text-gray-600 mt-1">Perbarui informasi produk</p>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="text-gray-600 mt-2">Memuat data...</p>
		</div>
	{:else if product}
		<div class="bg-white rounded-lg shadow p-6">
			<ProductForm {product} {members} onsubmit={handleSubmit} oncancel={handleCancel} loading={saving} />
		</div>
	{/if}
</div>
