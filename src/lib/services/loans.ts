import { ApiService } from './api';
import type { Loan, LoanPayment, LoanFilters, CreateLoanDto, CreatePaymentDto } from '$lib/types';

class LoanService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Get all loans with optional filters
	 */
	async getLoans(filters?: LoanFilters): Promise<Loan[]> {
		const params = new URLSearchParams();
		if (filters?.memberId) params.append('memberId', filters.memberId);
		if (filters?.status) params.append('status', filters.status);
		if (filters?.overdue !== undefined) params.append('overdue', filters.overdue.toString());

		const query = params.toString();
		const endpoint = query ? `/loans?${query}` : '/loans';

		const response = await this.get<Loan[]>(endpoint);
		return response.data || [];
	}

	/**
	 * Get a single loan by ID
	 */
	async getLoan(id: string): Promise<Loan> {
		const response = await this.get<Loan>(`/loans/${id}`);
		if (!response.data) {
			throw new Error('Pinjaman tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Create a new loan
	 */
	async createLoan(data: CreateLoanDto): Promise<Loan> {
		const response = await this.post<Loan>('/loans', data);
		if (!response.data) {
			throw new Error('Gagal membuat pinjaman');
		}
		return response.data;
	}

	/**
	 * Get payments for a specific loan
	 */
	async getLoanPayments(loanId: string): Promise<LoanPayment[]> {
		const response = await this.get<LoanPayment[]>(`/loans/${loanId}/payments`);
		return response.data || [];
	}

	/**
	 * Create a loan payment
	 */
	async createPayment(loanId: string, data: CreatePaymentDto): Promise<LoanPayment> {
		const response = await this.post<LoanPayment>(`/loans/${loanId}/payments`, data);
		if (!response.data) {
			throw new Error('Gagal membuat pembayaran');
		}
		return response.data;
	}
}

export const loanService = new LoanService();
