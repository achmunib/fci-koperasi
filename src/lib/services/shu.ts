import { ApiService } from './api';
import type { SHUDistribution, SHUMemberShare, SHUCalculationParams } from '$lib/types';

class SHUService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Calculate SHU distribution
	 */
	async calculateSHU(params: SHUCalculationParams): Promise<SHUMemberShare[]> {
		const response = await this.post<SHUMemberShare[]>('/shu/calculate', params);
		if (!response.data) {
			throw new Error('Gagal menghitung SHU');
		}
		return response.data;
	}

	/**
	 * Distribute SHU to members
	 */
	async distributeSHU(distributionId: string): Promise<SHUDistribution> {
		const response = await this.post<SHUDistribution>(`/shu/${distributionId}/distribute`);
		if (!response.data) {
			throw new Error('Gagal mendistribusikan SHU');
		}
		return response.data;
	}

	/**
	 * Get SHU distribution history
	 */
	async getSHUHistory(): Promise<SHUDistribution[]> {
		const response = await this.get<SHUDistribution[]>('/shu/history');
		return response.data || [];
	}

	/**
	 * Get SHU distribution by ID
	 */
	async getSHUDistribution(id: string): Promise<SHUDistribution> {
		const response = await this.get<SHUDistribution>(`/shu/${id}`);
		if (!response.data) {
			throw new Error('Distribusi SHU tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Get member shares for a distribution
	 */
	async getMemberShares(distributionId: string): Promise<SHUMemberShare[]> {
		const response = await this.get<SHUMemberShare[]>(`/shu/${distributionId}/shares`);
		return response.data || [];
	}
}

export const shuService = new SHUService();
