<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { productService } from '$lib/services';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import { ArrowLeft, Edit, Package, User, Tag, DollarSign } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	const productId = $derived($page.params.id);

	let product = $state<Product | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const statusColors = {
		available: 'bg-green-100 text-green-800',
		out_of_stock: 'bg-yellow-100 text-yellow-800',
		discontinued: 'bg-red-100 text-red-800'
	};

	const statusLabels = {
		available: 'Tersedia',
		out_of_stock: 'Stok Habis',
		discontinued: 'Dihentikan'
	};

	onMount(async () => {
		await loadProduct();
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
		<div class="bg-white rounded-lg shadow">
			<div class="p-6 border-b border-gray-200">
				<div class="flex items-start justify-between">
					<div class="flex items-center gap-4">
						<div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
							<Package class="w-8 h-8 text-blue-600" />
						</div>
						<div>
							<h1 class="text-2xl font-bold text-gray-900">{product.name}</h1>
							<p class="text-gray-600">{product.category}</p>
						</div>
					</div>
					<div class="flex gap-3">
						<span class="px-3 py-1 rounded-full text-sm font-medium {statusColors[product.status]}">
							{statusLabels[product.status]}
						</span>
						<Button variant="primary" onclick={() => goto(`/products/${product.id}/edit`)}>
							<Edit class="w-4 h-4 mr-2" />
							Edit
						</Button>
					</div>
				</div>
			</div>

			<div class="p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Produk</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="flex items-start gap-3 md:col-span-2">
						<Package class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Deskripsi</p>
							<p class="text-gray-900">{product.description}</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<DollarSign class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Harga</p>
							<p class="text-gray-900 font-semibold">{formatIDR(product.price)} / {product.unit}</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<Tag class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Kategori</p>
							<p class="text-gray-900">{product.category}</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<User class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Produsen</p>
							<button
								type="button"
								onclick={() => goto(`/members/${product.producerId}`)}
								class="text-blue-600 hover:text-blue-800 font-medium"
							>
								{product.producerName}
							</button>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<Package class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Status</p>
							<p class="text-gray-900">{statusLabels[product.status]}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card title="Total Transaksi">
				<div class="text-3xl font-bold text-gray-900">0</div>
				<p class="text-sm text-gray-600 mt-1">Belum ada transaksi</p>
			</Card>

			<Card title="Total Penjualan">
				<div class="text-3xl font-bold text-gray-900">Rp 0</div>
				<p class="text-sm text-gray-600 mt-1">Belum ada penjualan</p>
			</Card>
		</div>
	{/if}
</div>
