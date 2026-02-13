import type { User, ApiResponse } from '$lib/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface LoginResponse {
	user: User;
	token: string;
}

/**
 * Authentication service for handling login, logout, and token management
 */
export class AuthService {
	/**
	 * Login with username and password
	 * @param credentials - Login credentials
	 * @returns Promise resolving to user and token
	 */
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(credentials)
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Login gagal');
			}

			const data: ApiResponse<LoginResponse> = await response.json();

			if (!data.success || !data.data) {
				throw new Error(data.error || 'Login gagal');
			}

			return data.data;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Terjadi kesalahan saat login');
		}
	}

	/**
	 * Logout current user
	 * @param token - Auth token
	 */
	async logout(token: string): Promise<void> {
		try {
			await fetch(`${API_BASE_URL}/auth/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
		} catch (error) {
			// Logout should succeed even if API call fails
			console.error('Logout error:', error);
		}
	}

	/**
	 * Validate token and get user data
	 * @param token - Auth token to validate
	 * @returns Promise resolving to user data
	 */
	async validateToken(token: string): Promise<User> {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/validate`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Token tidak valid');
			}

			const data: ApiResponse<User> = await response.json();

			if (!data.success || !data.data) {
				throw new Error('Token tidak valid');
			}

			return data.data;
		} catch (error) {
			throw new Error('Token tidak valid atau sudah kadaluarsa');
		}
	}

	/**
	 * Refresh authentication token
	 * @param token - Current auth token
	 * @returns Promise resolving to new token
	 */
	async refreshToken(token: string): Promise<string> {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Gagal memperbarui token');
			}

			const data: ApiResponse<{ token: string }> = await response.json();

			if (!data.success || !data.data) {
				throw new Error('Gagal memperbarui token');
			}

			return data.data.token;
		} catch (error) {
			throw new Error('Gagal memperbarui token');
		}
	}

	/**
	 * Store token in localStorage
	 * @param token - Token to store
	 */
	storeToken(token: string): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem('auth_token', token);
		}
	}

	/**
	 * Retrieve token from localStorage
	 * @returns Stored token or null
	 */
	getStoredToken(): string | null {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('auth_token');
		}
		return null;
	}

	/**
	 * Remove token from localStorage
	 */
	clearToken(): void {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('auth_token');
		}
	}
}

// Export singleton instance
export const authService = new AuthService();
