<script lang="ts">
	import type { Product } from '$lib/types';
	import { formatIDR } from '$lib/utils/currency';
	import { Edit, Trash2, Eye, Package } from 'lucide-svelte';

	interface Props {
		products: Product[];
		viewMode?: 'grid' | 'list';
		onview?: (product: Product) => void;
		onedit?: (product: Product) => void;
		ondelete?: (product: Product) => void;
	}

	let { products, viewMode = 'list', onview, onedit, ondelete }: Props = $props();

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
</script>

{#if viewMode === 'grid'}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#if products.length === 0}
			<div class="col-span-full text-center py-12 text-gray-500">
				Tidak ada data produk
			</div>
		{:else}
			{#each products as product (product.id)}
				<div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
					<div class="p-6">
						<div class="flex items-start justify-between mb-4">
							<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<Package class="w-6 h-6 text-blue-600" />
							</div>
							<span class="px-2 py-1 rounded-full text-xs font-medium {statusColors[product.status]}">
								{statusLabels[product.status]}
							</span>
						</div>

						<h3 class="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
						<p class="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

						<div class="space-y-2 mb-4">
							<div class="flex justify-between text-sm">
								<span class="text-gray-500">Harga</span>
								<span class="font-semibold text-gray-900">{formatIDR(product.price)}/{product.unit}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500">Kategori</span>
								<span class="text-gray-900">{product.category}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500">Produsen</span>
								<span class="text-gray-900">{product.producerName}</span>
							</div>
						</div>

						<div class="flex gap-2 pt-4 border-t">
							{#if onview}
								<button
									type="button"
									onclick={() => onview(product)}
									class="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								>
									<Eye class="w-4 h-4 inline mr-1" />
									Lihat
								</button>
							{/if}
							{#if onedit}
								<button
									type="button"
									onclick={() => onedit(product)}
									class="flex-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
								>
									<Edit class="w-4 h-4 inline mr-1" />
									Edit
								</button>
							{/if}
							{#if ondelete}
								<button
									type="button"
									onclick={() => ondelete(product)}
									class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								>
									<Trash2 class="w-4 h-4" />
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Produk
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Kategori
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Harga
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Produsen
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Status
					</th>
					<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Aksi
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#if products.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-8 text-center text-gray-500">
							Tidak ada data produk
						</td>
					</tr>
				{:else}
					{#each products as product (product.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="flex items-center">
									<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
										<Package class="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<div class="text-sm font-medium text-gray-900">{product.name}</div>
										<div class="text-sm text-gray-500 line-clamp-1">{product.description}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{product.category}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{formatIDR(product.price)}</div>
								<div class="text-sm text-gray-500">per {product.unit}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{product.producerName}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {statusColors[product.status]}">
									{statusLabels[product.status]}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<div class="flex gap-2 justify-end">
									{#if onview}
										<button
											type="button"
											onclick={() => onview(product)}
											class="text-blue-600 hover:text-blue-900"
											title="Lihat Detail"
										>
											<Eye class="w-4 h-4" />
										</button>
									{/if}
									{#if onedit}
										<button
											type="button"
											onclick={() => onedit(product)}
											class="text-green-600 hover:text-green-900"
											title="Edit"
										>
											<Edit class="w-4 h-4" />
										</button>
									{/if}
									{#if ondelete}
										<button
											type="button"
											onclick={() => ondelete(product)}
											class="text-red-600 hover:text-red-900"
											title="Hapus"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{/if}
