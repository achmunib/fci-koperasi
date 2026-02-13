import type { ApiResponse } from '$lib/types';
import { authStore } from '$lib/stores/auth';

const API_BASE_URL = '/api';

/**
 * Base API service class with common HTTP methods
 */
export class ApiService {
	private baseUrl: string;

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl;
	}

	/**
	 * Get authorization header with token
	 */
	private getAuthHeaders(): HeadersInit {
		const token = authStore.getToken();
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	}

	/**
	 * Handle API response and errors
	 */
	private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
		const contentType = response.headers.get('content-type');
		const isJson = contentType?.includes('application/json');

		if (!response.ok) {
			if (response.status === 401) {
				// Unauthorized - clear auth and redirect to login
				authStore.logout();
				window.location.href = '/login';
				throw new Error('Sesi telah berakhir. Silakan login kembali.');
			}

			if (isJson) {
				const error = await response.json();
				throw new Error(error.error || error.message || 'Terjadi kesalahan');
			}

			throw new Error(`HTTP Error: ${response.status}`);
		}

		if (isJson) {
			return await response.json();
		}

		return {
			success: true,
			data: null as any
		};
	}

	/**
	 * GET request
	 * @param endpoint - API endpoint
	 * @returns Promise resolving to API response
	 */
	async get<T>(endpoint: string): Promise<ApiResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'GET',
				headers: this.getAuthHeaders()
			});

			return await this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Terjadi kesalahan saat mengambil data');
		}
	}

	/**
	 * POST request
	 * @param endpoint - API endpoint
	 * @param data - Request body data
	 * @returns Promise resolving to API response
	 */
	async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'POST',
				headers: this.getAuthHeaders(),
				body: data ? JSON.stringify(data) : undefined
			});

			return await this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Terjadi kesalahan saat menyimpan data');
		}
	}

	/**
	 * PUT request
	 * @param endpoint - API endpoint
	 * @param data - Request body data
	 * @returns Promise resolving to API response
	 */
	async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'PUT',
				headers: this.getAuthHeaders(),
				body: data ? JSON.stringify(data) : undefined
			});

			return await this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Terjadi kesalahan saat memperbarui data');
		}
	}

	/**
	 * PATCH request
	 * @param endpoint - API endpoint
	 * @param data - Request body data
	 * @returns Promise resolving to API response
	 */
	async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'PATCH',
				headers: this.getAuthHeaders(),
				body: data ? JSON.stringify(data) : undefined
			});

			return await this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Terjadi kesalahan saat memperbarui data');
		}
	}

	/**
	 * DELETE request
	 * @param endpoint - API endpoint
	 * @returns Promise resolving to API response
	 */
	async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'DELETE',
				headers: this.getAuthHeaders()
			});

			return await this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Terjadi kesalahan saat menghapus data');
		}
	}
}

// Export singleton instance
export const apiService = new ApiService();
