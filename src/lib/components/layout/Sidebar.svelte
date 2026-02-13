<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth';
	import {
		Home,
		Users,
		Package,
		ShoppingCart,
		Wallet,
		CreditCard,
		PieChart,
		Calendar,
		FileText,
		Menu,
		X
	} from 'lucide-svelte';
	import type { User } from '$lib/types';

	interface Props {
		isOpen?: boolean;
		onToggle?: () => void;
		onClose?: () => void;
	}

	let { isOpen = $bindable(true), onToggle, onClose }: Props = $props();

	interface MenuItem {
		href: string;
		label: string;
		icon: any;
		roles: Array<User['role']>;
	}

	const allMenuItems: MenuItem[] = [
		{ href: '/', label: 'Dashboard', icon: Home, roles: ['admin', 'member', 'viewer'] },
		{ href: '/members', label: 'Anggota', icon: Users, roles: ['admin'] },
		{ href: '/products', label: 'Produk', icon: Package, roles: ['admin', 'member'] },
		{
			href: '/transactions',
			label: 'Transaksi',
			icon: ShoppingCart,
			roles: ['admin', 'member', 'viewer']
		},
		{ href: '/savings', label: 'Simpanan', icon: Wallet, roles: ['admin', 'member', 'viewer'] },
		{ href: '/loans', label: 'Pinjaman', icon: CreditCard, roles: ['admin', 'member', 'viewer'] },
		{ href: '/shu', label: 'SHU', icon: PieChart, roles: ['admin', 'member', 'viewer'] },
		{ href: '/meetings', label: 'Rapat', icon: Calendar, roles: ['admin', 'member'] },
		{ href: '/reports', label: 'Laporan', icon: FileText, roles: ['admin', 'member', 'viewer'] }
	];

	// Use $derived for reactive values from stores
	const userRole = $derived($authStore.user?.role || 'viewer');

	// Filter menu items based on user role
	const menuItems = $derived(
		allMenuItems.filter((item) => item.roles.includes(userRole as User['role']))
	);

	const currentPath = $derived($page.url.pathname);

	function isActive(href: string): boolean {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}

	function handleLinkClick() {
		// Close sidebar on mobile when clicking a link
		onClose?.();
	}
</script>

<!-- Mobile menu button -->
<button
	onclick={onToggle}
	class="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden"
	aria-label="Toggle menu"
>
	{#if isOpen}
		<X class="h-6 w-6 text-gray-600" />
	{:else}
		<Menu class="h-6 w-6 text-gray-600" />
	{/if}
</button>

<!-- Sidebar -->
<aside
	class="fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 {isOpen
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<div class="flex h-full flex-col">
		<!-- Logo -->
		<div class="flex h-16 items-center justify-center border-b border-gray-200 px-4 lg:px-6">
			<h1 class="text-lg sm:text-xl font-bold text-blue-600 text-center">Koperasi Produsen</h1>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 overflow-y-auto px-3 py-4 lg:px-4 lg:py-6">
			<ul class="space-y-1 lg:space-y-2">
				{#each menuItems as item}
					{@const Icon = item.icon}
					{@const active = isActive(item.href)}
					<li>
						<a
							href={item.href}
							onclick={handleLinkClick}
							class="flex items-center rounded-lg px-3 py-2.5 lg:px-4 lg:py-3 text-sm font-medium transition-colors {active
								? 'bg-blue-50 text-blue-600'
								: 'text-gray-700 hover:bg-gray-50'}"
						>
							<Icon class="mr-3 h-5 w-5 flex-shrink-0" />
							<span class="truncate">{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Footer -->
		<div class="border-t border-gray-200 p-3 lg:p-4">
			<p class="text-center text-xs text-gray-500">© 2024 Koperasi Produsen</p>
		</div>
	</div>
</aside>

<!-- Overlay for mobile -->
{#if isOpen}
	<div
		class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
		onclick={onToggle}
		role="button"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Enter' && onToggle?.()}
	></div>
{/if}
