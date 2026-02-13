import { ApiService } from './api';
import type { Transaction, TransactionFilters, CreateTransactionDto } from '$lib/types';

class TransactionService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Get all transactions with optional filters
	 */
	async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
		const params = new URLSearchParams();
		if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
		if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
		if (filters?.memberId) params.append('memberId', filters.memberId);
		if (filters?.productId) params.append('productId', filters.productId);

		const query = params.toString();
		const endpoint = query ? `/transactions?${query}` : '/transactions';

		const response = await this.get<Transaction[]>(endpoint);
		return response.data || [];
	}

	/**
	 * Get a single transaction by ID
	 */
	async getTransaction(id: string): Promise<Transaction> {
		const response = await this.get<Transaction>(`/transactions/${id}`);
		if (!response.data) {
			throw new Error('Transaksi tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Create a new transaction
	 */
	async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
		const response = await this.post<Transaction>('/transactions', data);
		if (!response.data) {
			throw new Error('Gagal membuat transaksi');
		}
		return response.data;
	}

	/**
	 * Get transactions for a specific member
	 */
	async getMemberTransactions(memberId: string): Promise<Transaction[]> {
		const response = await this.get<Transaction[]>(`/members/${memberId}/transactions`);
		return response.data || [];
	}
}

export const transactionService = new TransactionService();
