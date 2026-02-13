import { writable } from 'svelte/store';
import type { User, AuthState } from '$lib/types';

const STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

// Initialize auth state from localStorage if available
function getInitialState(): AuthState {
	if (typeof window === 'undefined') {
		return {
			user: null,
			token: null,
			isAuthenticated: false
		};
	}

	const token = localStorage.getItem(STORAGE_KEY);
	const userJson = localStorage.getItem(USER_STORAGE_KEY);
	
	// Restore user data if available
	let user: User | null = null;
	if (userJson) {
		try {
			user = JSON.parse(userJson);
		} catch (e) {
			console.error('Failed to parse user data:', e);
		}
	}

	return {
		user,
		token,
		isAuthenticated: !!token && !!user
	};
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(getInitialState());

	return {
		subscribe,

		/**
		 * Login with credentials
		 * @param username - User's username
		 * @param password - User's password
		 * @returns Promise resolving to user data
		 */
		login: async (username: string, password: string): Promise<User> => {
			// Call API endpoint
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(data.error || 'Login gagal');
			}

			const { user, token } = data.data;

			// Store token and user data in localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, token);
				localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
			}

			// Update store
			set({
				user,
				token,
				isAuthenticated: true
			});

			return user;
		},

		/**
		 * Logout current user
		 */
		logout: () => {
			// Clear token and user data from localStorage
			if (typeof window !== 'undefined') {
				localStorage.removeItem(STORAGE_KEY);
				localStorage.removeItem(USER_STORAGE_KEY);
				// Clear cookie
				document.cookie = 'auth_token=; path=/; max-age=0';
			}

			// Reset store
			set({
				user: null,
				token: null,
				isAuthenticated: false
			});
		},

		/**
		 * Set user data (used after token validation)
		 * @param user - User data
		 */
		setUser: (user: User) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: true
			}));
		},

		/**
		 * Get current token
		 * @returns Current auth token or null
		 */
		getToken: (): string | null => {
			if (typeof window === 'undefined') return null;
			return localStorage.getItem(STORAGE_KEY);
		},

		/**
		 * Check if user is authenticated
		 * @returns true if user is authenticated
		 */
		isAuthenticated: (): boolean => {
			if (typeof window === 'undefined') return false;
			return !!localStorage.getItem(STORAGE_KEY);
		}
	};
}

export const authStore = createAuthStore();
