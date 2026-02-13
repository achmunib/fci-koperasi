<script lang="ts" generics="T">
	import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-svelte';

	interface Column<T> {
		key: string;
		label: string;
		sortable?: boolean;
		render?: (item: T) => string;
	}

	interface Props {
		columns: Column<T>[];
		data: T[];
		sortable?: boolean;
		paginated?: boolean;
		pageSize?: number;
		onrowclick?: (item: T) => void;
	}

	let {
		columns,
		data,
		sortable = false,
		paginated = false,
		pageSize = 10,
		onrowclick
	}: Props = $props();

	let sortKey = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');
	let currentPage = $state(1);

	// Sorted data
	const sortedData = $derived(() => {
		if (!sortKey || !sortable) return data;

		return [...data].sort((a, b) => {
			const aVal = (a as any)[sortKey];
			const bVal = (b as any)[sortKey];

			if (aVal === bVal) return 0;

			const comparison = aVal < bVal ? -1 : 1;
			return sortDirection === 'asc' ? comparison : -comparison;
		});
	});

	// Paginated data
	const paginatedData = $derived(() => {
		const sorted = sortedData();
		if (!paginated) return sorted;

		const start = (currentPage - 1) * pageSize;
		const end = start + pageSize;
		return sorted.slice(start, end);
	});

	const totalPages = $derived(Math.ceil(data.length / pageSize));

	function handleSort(key: string) {
		if (!sortable) return;

		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = 'asc';
		}
	}

	function handlePageChange(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
	}

	function getCellValue(item: T, column: Column<T>): string {
		if (column.render) {
			return column.render(item);
		}
		return String((item as any)[column.key] ?? '');
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				{#each columns as column (column.key)}
					<th
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						class:cursor-pointer={sortable && column.sortable !== false}
						onclick={() => sortable && column.sortable !== false && handleSort(column.key)}
					>
						<div class="flex items-center gap-2">
							<span>{column.label}</span>
							{#if sortable && column.sortable !== false}
								{#if sortKey === column.key}
									{#if sortDirection === 'asc'}
										<ChevronUp class="w-4 h-4" />
									{:else}
										<ChevronDown class="w-4 h-4" />
									{/if}
								{:else}
									<ChevronsUpDown class="w-4 h-4 text-gray-400" />
								{/if}
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
			{#if paginatedData().length === 0}
				<tr>
					<td colspan={columns.length} class="px-6 py-8 text-center text-gray-500">
						Tidak ada data
					</td>
				</tr>
			{:else}
				{#each paginatedData() as item, index (index)}
					<tr
						class:hover:bg-gray-50={onrowclick}
						class:cursor-pointer={onrowclick}
						onclick={() => onrowclick?.(item)}
					>
						{#each columns as column (column.key)}
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{getCellValue(item, column)}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>

	{#if paginated && totalPages > 1}
		<div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
			<div class="flex-1 flex justify-between sm:hidden">
				<button
					type="button"
					onclick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Sebelumnya
				</button>
				<button
					type="button"
					onclick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Selanjutnya
				</button>
			</div>
			<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
				<div>
					<p class="text-sm text-gray-700">
						Menampilkan
						<span class="font-medium">{(currentPage - 1) * pageSize + 1}</span>
						sampai
						<span class="font-medium">{Math.min(currentPage * pageSize, data.length)}</span>
						dari
						<span class="font-medium">{data.length}</span>
						hasil
					</p>
				</div>
				<div>
					<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
						<button
							type="button"
							onclick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span class="sr-only">Sebelumnya</span>
							<ChevronUp class="h-5 w-5 rotate-[-90deg]" />
						</button>
						{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
							{#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
								<button
									type="button"
									onclick={() => handlePageChange(page)}
									class="relative inline-flex items-center px-4 py-2 border text-sm font-medium {page === currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}"
								>
									{page}
								</button>
							{:else if page === currentPage - 2 || page === currentPage + 2}
								<span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
									...
								</span>
							{/if}
						{/each}
						<button
							type="button"
							onclick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span class="sr-only">Selanjutnya</span>
							<ChevronDown class="h-5 w-5 rotate-[-90deg]" />
						</button>
					</nav>
				</div>
			</div>
		</div>
	{/if}
</div>
