import { ApiService } from './api';
import type {
	SavingsSummary,
	SavingsTransaction,
	CreateDepositDto,
	CreateWithdrawalDto
} from '$lib/types';

class SavingsService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Get savings summary for all members
	 */
	async getSavingsSummary(): Promise<SavingsSummary[]> {
		const response = await this.get<SavingsSummary[]>('/savings');
		return response.data || [];
	}

	/**
	 * Get savings summary for a specific member
	 */
	async getMemberSavings(memberId: string): Promise<SavingsSummary> {
		const response = await this.get<SavingsSummary>(`/savings/${memberId}`);
		if (!response.data) {
			throw new Error('Data simpanan tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Get savings transactions for a specific member
	 */
	async getSavingsTransactions(memberId: string): Promise<SavingsTransaction[]> {
		const response = await this.get<SavingsTransaction[]>(`/savings/${memberId}/transactions`);
		return response.data || [];
	}

	/**
	 * Create a deposit transaction
	 */
	async createDeposit(data: CreateDepositDto): Promise<SavingsTransaction> {
		const response = await this.post<SavingsTransaction>('/savings/deposit', data);
		if (!response.data) {
			throw new Error('Gagal membuat setoran');
		}
		return response.data;
	}

	/**
	 * Create a withdrawal transaction
	 */
	async createWithdrawal(data: CreateWithdrawalDto): Promise<SavingsTransaction> {
		const response = await this.post<SavingsTransaction>('/savings/withdrawal', data);
		if (!response.data) {
			throw new Error('Gagal membuat penarikan');
		}
		return response.data;
	}
}

export const savingsService = new SavingsService();
