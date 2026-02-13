import { writable, derived } from 'svelte/store';
import type { Product } from '$lib/types';

interface ProductState {
	products: Product[];
	loading: boolean;
	error: string | null;
	searchQuery: string;
	categoryFilter: string;
	statusFilter: 'all' | 'available' | 'out_of_stock' | 'discontinued';
	producerFilter: string;
}

const initialState: ProductState = {
	products: [],
	loading: false,
	error: null,
	searchQuery: '',
	categoryFilter: 'all',
	statusFilter: 'all',
	producerFilter: 'all'
};

function createProductStore() {
	const { subscribe, set, update } = writable<ProductState>(initialState);

	return {
		subscribe,
		setProducts: (products: Product[]) => update((state) => ({ ...state, products })),
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
		setError: (error: string | null) => update((state) => ({ ...state, error })),
		setSearchQuery: (query: string) => update((state) => ({ ...state, searchQuery: query })),
		setCategoryFilter: (category: string) =>
			update((state) => ({ ...state, categoryFilter: category })),
		setStatusFilter: (status: 'all' | 'available' | 'out_of_stock' | 'discontinued') =>
			update((state) => ({ ...state, statusFilter: status })),
		setProducerFilter: (producer: string) =>
			update((state) => ({ ...state, producerFilter: producer })),
		addProduct: (product: Product) =>
			update((state) => ({ ...state, products: [product, ...state.products] })),
		updateProduct: (id: string, updatedProduct: Product) =>
			update((state) => ({
				...state,
				products: state.products.map((p) => (p.id === id ? updatedProduct : p))
			})),
		removeProduct: (id: string) =>
			update((state) => ({
				...state,
				products: state.products.filter((p) => p.id !== id)
			})),
		reset: () => set(initialState)
	};
}

export const productStore = createProductStore();

// Derived store for filtered products
export const filteredProducts = derived(productStore, ($productStore) => {
	let filtered = $productStore.products;

	// Filter by status
	if ($productStore.statusFilter !== 'all') {
		filtered = filtered.filter((p) => p.status === $productStore.statusFilter);
	}

	// Filter by category
	if ($productStore.categoryFilter !== 'all') {
		filtered = filtered.filter((p) => p.category === $productStore.categoryFilter);
	}

	// Filter by producer
	if ($productStore.producerFilter !== 'all') {
		filtered = filtered.filter((p) => p.producerId === $productStore.producerFilter);
	}

	// Filter by search query
	if ($productStore.searchQuery) {
		const query = $productStore.searchQuery.toLowerCase();
		filtered = filtered.filter(
			(p) =>
				p.name.toLowerCase().includes(query) ||
				p.description.toLowerCase().includes(query) ||
				p.producerName.toLowerCase().includes(query) ||
				p.category.toLowerCase().includes(query)
		);
	}

	return filtered;
});

// Derived store for unique categories
export const productCategories = derived(productStore, ($productStore) => {
	const categories = new Set($productStore.products.map((p) => p.category));
	return Array.from(categories).sort();
});

// Derived store for unique producers
export const productProducers = derived(productStore, ($productStore) => {
	const producers = new Map<string, string>();
	$productStore.products.forEach((p) => {
		producers.set(p.producerId, p.producerName);
	});
	return Array.from(producers.entries()).map(([id, name]) => ({ id, name }));
});
