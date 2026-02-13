import { writable, derived } from 'svelte/store';
import type { Transaction } from '$lib/types';

interface TransactionState {
	transactions: Transaction[];
	loading: boolean;
	error: string | null;
	dateFrom: string;
	dateTo: string;
	memberFilter: string;
	productFilter: string;
}

const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const initialState: TransactionState = {
	transactions: [],
	loading: false,
	error: null,
	dateFrom: firstDayOfMonth.toISOString().split('T')[0],
	dateTo: today.toISOString().split('T')[0],
	memberFilter: 'all',
	productFilter: 'all'
};

function createTransactionStore() {
	const { subscribe, set, update } = writable<TransactionState>(initialState);

	return {
		subscribe,
		setTransactions: (transactions: Transaction[]) =>
			update((state) => ({ ...state, transactions })),
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
		setError: (error: string | null) => update((state) => ({ ...state, error })),
		setDateFrom: (date: string) => update((state) => ({ ...state, dateFrom: date })),
		setDateTo: (date: string) => update((state) => ({ ...state, dateTo: date })),
		setMemberFilter: (memberId: string) => update((state) => ({ ...state, memberFilter: memberId })),
		setProductFilter: (productId: string) =>
			update((state) => ({ ...state, productFilter: productId })),
		addTransaction: (transaction: Transaction) =>
			update((state) => ({ ...state, transactions: [transaction, ...state.transactions] })),
		reset: () => set(initialState)
	};
}

export const transactionStore = createTransactionStore();

// Derived store for filtered transactions
export const filteredTransactions = derived(transactionStore, ($transactionStore) => {
	let filtered = $transactionStore.transactions;

	// Filter by date range
	if ($transactionStore.dateFrom) {
		const fromDate = new Date($transactionStore.dateFrom);
		filtered = filtered.filter((t) => new Date(t.date) >= fromDate);
	}

	if ($transactionStore.dateTo) {
		const toDate = new Date($transactionStore.dateTo);
		toDate.setHours(23, 59, 59, 999); // End of day
		filtered = filtered.filter((t) => new Date(t.date) <= toDate);
	}

	// Filter by member
	if ($transactionStore.memberFilter !== 'all') {
		filtered = filtered.filter((t) => t.memberId === $transactionStore.memberFilter);
	}

	// Filter by product
	if ($transactionStore.productFilter !== 'all') {
		filtered = filtered.filter((t) => t.productId === $transactionStore.productFilter);
	}

	// Sort by date descending (newest first)
	return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
