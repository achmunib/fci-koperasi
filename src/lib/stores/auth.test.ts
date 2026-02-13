import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { authStore } from './auth';

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		}
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock
});

describe('Auth Store', () => {
	beforeEach(() => {
		localStorageMock.clear();
		authStore.logout();
	});

	it('should initialize with unauthenticated state', () => {
		const state = get(authStore);
		expect(state.isAuthenticated).toBe(false);
		expect(state.user).toBeNull();
		expect(state.token).toBeNull();
	});

	it('should store token on successful login', async () => {
		// Mock fetch
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				success: true,
				data: {
					user: { id: '1', username: 'testuser', name: 'Test User', role: 'admin' },
					token: 'test-token'
				}
			})
		}) as any;

		await authStore.login('testuser', 'password');

		const state = get(authStore);
		expect(state.isAuthenticated).toBe(true);
		expect(state.token).toBe('test-token');
		expect(state.user?.username).toBe('testuser');
		expect(localStorageMock.getItem('auth_token')).toBe('test-token');
	});

	it('should clear state on logout', () => {
		localStorageMock.setItem('auth_token', 'test-token');

		authStore.logout();

		const state = get(authStore);
		expect(state.isAuthenticated).toBe(false);
		expect(state.user).toBeNull();
		expect(state.token).toBeNull();
		expect(localStorageMock.getItem('auth_token')).toBeNull();
	});

	it('should set user data', () => {
		const user = {
			id: '1',
			username: 'testuser',
			name: 'Test User',
			role: 'admin' as const
		};

		authStore.setUser(user);

		const state = get(authStore);
		expect(state.user).toEqual(user);
		expect(state.isAuthenticated).toBe(true);
	});

	it('should get token from localStorage', () => {
		localStorageMock.setItem('auth_token', 'test-token');
		expect(authStore.getToken()).toBe('test-token');
	});

	it('should check authentication status', () => {
		expect(authStore.isAuthenticated()).toBe(false);

		localStorageMock.setItem('auth_token', 'test-token');
		expect(authStore.isAuthenticated()).toBe(true);
	});
});
