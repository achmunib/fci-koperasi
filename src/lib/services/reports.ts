import { ApiService } from './api';
import type { DateRange, PersonalReport, CooperativeReport } from '$lib/types';

class ReportService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Get personal financial report for a member
	 */
	async getPersonalReport(memberId: string, dateRange: DateRange): Promise<PersonalReport> {
		const params = new URLSearchParams({
			startDate: dateRange.startDate.toISOString(),
			endDate: dateRange.endDate.toISOString()
		});

		const response = await this.get<PersonalReport>(
			`/reports/personal/${memberId}?${params.toString()}`
		);
		if (!response.data) {
			throw new Error('Laporan tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Get cooperative-wide financial report
	 */
	async getCooperativeReport(dateRange: DateRange): Promise<CooperativeReport> {
		const params = new URLSearchParams({
			startDate: dateRange.startDate.toISOString(),
			endDate: dateRange.endDate.toISOString()
		});

		const response = await this.get<CooperativeReport>(
			`/reports/cooperative?${params.toString()}`
		);
		if (!response.data) {
			throw new Error('Laporan tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Export report in specified format
	 */
	async exportReport(
		reportType: 'personal' | 'cooperative',
		format: 'pdf' | 'csv',
		params: any
	): Promise<Blob> {
		const queryParams = new URLSearchParams({
			format,
			...params
		});

		const response = await fetch(
			`${this['baseUrl']}/reports/${reportType}/export?${queryParams.toString()}`,
			{
				method: 'GET',
				headers: this['getAuthHeaders']()
			}
		);

		if (!response.ok) {
			throw new Error('Gagal mengekspor laporan');
		}

		return await response.blob();
	}

	/**
	 * Download exported report
	 */
	downloadReport(blob: Blob, filename: string): void {
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	}
}

export const reportService = new ReportService();
