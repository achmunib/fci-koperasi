import type { User } from '$lib/types';

/**
 * Permission definitions for different features
 */
export const permissions = {
	// Member management
	'members.view': ['admin'],
	'members.create': ['admin'],
	'members.edit': ['admin'],
	'members.delete': ['admin'],

	// Product management
	'products.view': ['admin', 'member', 'viewer'],
	'products.create': ['admin', 'member'],
	'products.edit': ['admin', 'member'],
	'products.delete': ['admin', 'member'],

	// Transaction management
	'transactions.view': ['admin', 'member', 'viewer'],
	'transactions.create': ['admin'],
	'transactions.edit': ['admin'],
	'transactions.delete': ['admin'],

	// Savings management
	'savings.view': ['admin', 'member', 'viewer'],
	'savings.create': ['admin'],
	'savings.edit': ['admin'],
	'savings.delete': ['admin'],

	// Loan management
	'loans.view': ['admin', 'member', 'viewer'],
	'loans.create': ['admin'],
	'loans.edit': ['admin'],
	'loans.delete': ['admin'],
	'loans.approve': ['admin'],

	// SHU management
	'shu.view': ['admin', 'member', 'viewer'],
	'shu.calculate': ['admin'],
	'shu.distribute': ['admin'],

	// Meeting management
	'meetings.view': ['admin', 'member'],
	'meetings.create': ['admin'],
	'meetings.edit': ['admin'],
	'meetings.delete': ['admin'],
	'meetings.vote': ['admin', 'member'],

	// Report management
	'reports.view': ['admin', 'member', 'viewer'],
	'reports.export': ['admin', 'member'],
	'reports.viewAll': ['admin']
} as const;

export type Permission = keyof typeof permissions;

/**
 * Check if a user has a specific permission
 * @param userRole - User's role
 * @param permission - Permission to check
 * @returns true if user has permission
 */
export function hasPermission(userRole: User['role'], permission: Permission): boolean {
	const allowedRoles = permissions[permission];
	return (allowedRoles as readonly string[]).includes(userRole);
}

/**
 * Check if a user has any of the specified permissions
 * @param userRole - User's role
 * @param permissionList - List of permissions to check
 * @returns true if user has at least one permission
 */
export function hasAnyPermission(
	userRole: User['role'],
	permissionList: Permission[]
): boolean {
	return permissionList.some((permission) => hasPermission(userRole, permission));
}

/**
 * Check if a user has all of the specified permissions
 * @param userRole - User's role
 * @param permissionList - List of permissions to check
 * @returns true if user has all permissions
 */
export function hasAllPermissions(
	userRole: User['role'],
	permissionList: Permission[]
): boolean {
	return permissionList.every((permission) => hasPermission(userRole, permission));
}

/**
 * Filter items based on user permissions
 * @param userRole - User's role
 * @param items - Items to filter
 * @param getPermission - Function to get permission from item
 * @returns Filtered items
 */
export function filterByPermission<T>(
	userRole: User['role'],
	items: T[],
	getPermission: (item: T) => Permission
): T[] {
	return items.filter((item) => hasPermission(userRole, getPermission(item)));
}
