import { describe, it, expect } from 'vitest';
import { hasPermission, hasAnyPermission, hasAllPermissions, filterByPermission } from './permissions';
import type { Permission } from './permissions';

describe('Permissions utilities', () => {
	describe('hasPermission', () => {
		it('should grant admin access to member management', () => {
			expect(hasPermission('admin', 'members.view')).toBe(true);
			expect(hasPermission('admin', 'members.create')).toBe(true);
			expect(hasPermission('admin', 'members.edit')).toBe(true);
			expect(hasPermission('admin', 'members.delete')).toBe(true);
		});

		it('should deny member access to member management', () => {
			expect(hasPermission('member', 'members.view')).toBe(false);
			expect(hasPermission('member', 'members.create')).toBe(false);
		});

		it('should grant member access to product management', () => {
			expect(hasPermission('member', 'products.view')).toBe(true);
			expect(hasPermission('member', 'products.create')).toBe(true);
			expect(hasPermission('member', 'products.edit')).toBe(true);
		});

		it('should grant viewer read-only access', () => {
			expect(hasPermission('viewer', 'products.view')).toBe(true);
			expect(hasPermission('viewer', 'transactions.view')).toBe(true);
			expect(hasPermission('viewer', 'reports.view')).toBe(true);
		});

		it('should deny viewer write access', () => {
			expect(hasPermission('viewer', 'products.create')).toBe(false);
			expect(hasPermission('viewer', 'transactions.create')).toBe(false);
			expect(hasPermission('viewer', 'members.create')).toBe(false);
		});
	});

	describe('hasAnyPermission', () => {
		it('should return true if user has at least one permission', () => {
			expect(
				hasAnyPermission('member', ['members.view', 'products.view'])
			).toBe(true);
		});

		it('should return false if user has no permissions', () => {
			expect(
				hasAnyPermission('viewer', ['members.create', 'products.create'])
			).toBe(false);
		});
	});

	describe('hasAllPermissions', () => {
		it('should return true if user has all permissions', () => {
			expect(
				hasAllPermissions('admin', ['members.view', 'members.create'])
			).toBe(true);
		});

		it('should return false if user is missing any permission', () => {
			expect(
				hasAllPermissions('member', ['products.view', 'members.view'])
			).toBe(false);
		});
	});

	describe('filterByPermission', () => {
		it('should filter items based on permissions', () => {
			const items = [
				{ id: 1, permission: 'members.view' as Permission },
				{ id: 2, permission: 'products.view' as Permission },
				{ id: 3, permission: 'members.create' as Permission }
			];

			const filtered = filterByPermission(
				'member',
				items,
				(item) => item.permission
			);

			expect(filtered).toHaveLength(1);
			expect(filtered[0].id).toBe(2);
		});

		it('should return all items for admin', () => {
			const items = [
				{ id: 1, permission: 'members.view' as Permission },
				{ id: 2, permission: 'products.view' as Permission },
				{ id: 3, permission: 'members.create' as Permission }
			];

			const filtered = filterByPermission(
				'admin',
				items,
				(item) => item.permission
			);

			expect(filtered).toHaveLength(3);
		});
	});
});
