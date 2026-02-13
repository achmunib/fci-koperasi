<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		productStore,
		filteredProducts,
		productCategories,
		productProducers
	} from '$lib/stores/products';
	import { memberStore } from '$lib/stores/members';
	import { productService, memberService } from '$lib/services';
	import ProductList from '$lib/components/product/ProductList.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import { Plus, Search, Grid, List } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	let searchQuery = $state('');
	let categoryFilter = $state('all');
	let statusFilter = $state<'all' | 'available' | 'out_of_stock' | 'discontinued'>('all');
	let producerFilter = $state('all');
	let viewMode = $state<'grid' | 'list'>('list');
	let showDeleteModal = $state(false);
	let productToDelete = $state<Product | null>(null);
	let deleteError = $state<string | null>(null);
	let deleting = $state(false);

	const products = $derived($filteredProducts);
	const loading = $derived($productStore.loading);
	const error = $derived($productStore.error);
	const categories = $derived($productCategories);
	const producers = $derived($productProducers);

	const statusOptions = [
		{ value: 'all', label: 'Semua Status' },
		{ value: 'available', label: 'Tersedia' },
		{ value: 'out_of_stock', label: 'Stok Habis' },
		{ value: 'discontinued', label: 'Dihentikan' }
	];

	const categoryOptions = $derived([
		{ value: 'all', label: 'Semua Kategori' },
		...categories.map((c) => ({ value: c, label: c }))
	]);

	const producerOptions = $derived([
		{ value: 'all', label: 'Semua Produsen' },
		...producers.map((p) => ({ value: p.id, label: p.name }))
	]);

	onMount(async () => {
		await Promise.all([loadProducts(), loadMembers()]);
	});

	async function loadProducts() {
		productStore.setLoading(true);
		productStore.setError(null);

		try {
			const response = await productService.getProducts();
			if (response.success && response.data) {
				productStore.setProducts(response.data);
			} else {
				productStore.setError(response.error || 'Gagal memuat data produk');
			}
		} catch (err) {
			productStore.setError('Terjadi kesalahan saat memuat data');
		} finally {
			productStore.setLoading(false);
		}
	}

	async function loadMembers() {
		try {
			const response = await memberService.getMembers();
			if (response.success && response.data) {
				memberStore.setMembers(response.data);
			}
		} catch (err) {
			// Silent fail for members
		}
	}

	function handleSearch() {
		productStore.setSearchQuery(searchQuery);
	}

	function handleCategoryFilter() {
		productStore.setCategoryFilter(categoryFilter);
	}

	function handleStatusFilter() {
		productStore.setStatusFilter(statusFilter);
	}

	function handleProducerFilter() {
		productStore.setProducerFilter(producerFilter);
	}

	function handleView(product: Product) {
		goto(`/products/${product.id}`);
	}

	function handleEdit(product: Product) {
		goto(`/products/${product.id}/edit`);
	}

	function handleDeleteClick(product: Product) {
		productToDelete = product;
		deleteError = null;
		showDeleteModal = true;
	}

	async function confirmDelete() {
		if (!productToDelete) return;

		deleting = true;
		deleteError = null;

		try {
			const response = await productService.deleteProduct(productToDelete.id);
			if (response.success) {
				productStore.removeProduct(productToDelete.id);
				showDeleteModal = false;
				productToDelete = null;
			} else {
				deleteError = response.error || 'Gagal menghapus produk';
			}
		} catch (err) {
			deleteError = 'Terjadi kesalahan saat menghapus produk';
		} finally {
			deleting = false;
		}
	}

	function cancelDelete() {
		showDeleteModal = false;
		productToDelete = null;
		deleteError = null;
	}

	$effect(() => {
		handleSearch();
	});

	$effect(() => {
		handleCategoryFilter();
	});

	$effect(() => {
		handleStatusFilter();
	});

	$effect(() => {
		handleProducerFilter();
	});

</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
			<p class="text-gray-600 mt-1">Kelola produk anggota koperasi</p>
		</div>
		<Button variant="primary" onclick={() => goto('/products/new')}>
			<Plus class="w-4 h-4 mr-2" />
			Tambah Produk
		</Button>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		<div class="space-y-4 mb-6">
			<div class="flex items-center justify-between">
				<div class="flex-1 max-w-md">
					<Input
						type="text"
						placeholder="Cari nama produk, deskripsi, atau produsen..."
						bind:value={searchQuery}
					>
						<Search class="w-5 h-5 text-gray-400" slot="icon" />
					</Input>
				</div>
				<div class="flex gap-2 ml-4">
					<button
						type="button"
						onclick={() => (viewMode = 'list')}
						class="p-2 rounded-lg {viewMode === 'list'
							? 'bg-blue-100 text-blue-600'
							: 'text-gray-400 hover:bg-gray-100'}"
						title="Tampilan List"
					>
						<List class="w-5 h-5" />
					</button>
					<button
						type="button"
						onclick={() => (viewMode = 'grid')}
						class="p-2 rounded-lg {viewMode === 'grid'
							? 'bg-blue-100 text-blue-600'
							: 'text-gray-400 hover:bg-gray-100'}"
						title="Tampilan Grid"
					>
						<Grid class="w-5 h-5" />
					</button>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Select options={categoryOptions} bind:value={categoryFilter} />
				<Select options={producerOptions} bind:value={producerFilter} />
				<Select options={statusOptions} bind:value={statusFilter} />
			</div>
		</div>

		{#if loading}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else}
			<ProductList
				{products}
				{viewMode}
				onview={handleView}
				onedit={handleEdit}
				ondelete={handleDeleteClick}
			/>
		{/if}
	</div>
</div>

<Modal open={showDeleteModal} title="Konfirmasi Hapus" onclose={cancelDelete}>
	<div class="space-y-4">
		{#if deleteError}
			<Alert type="error" message={deleteError} />
		{/if}

		<p class="text-gray-700">
			Apakah Anda yakin ingin menghapus produk <strong>{productToDelete?.name}</strong>?
		</p>
		<p class="text-sm text-gray-600">
			Produk dengan riwayat transaksi tidak dapat dihapus.
		</p>
	</div>

	<div slot="footer" class="flex gap-3 justify-end">
		<Button variant="secondary" onclick={cancelDelete} disabled={deleting}>
			Batal
		</Button>
		<Button variant="danger" onclick={confirmDelete} loading={deleting}>
			Hapus
		</Button>
	</div>
</Modal>
