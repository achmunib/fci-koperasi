<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth';
	import { AppLayout } from '$lib/components/layout';
	import { Toast } from '$lib/components/common';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// Protected routes (require authentication)
	const protectedRoutes = [
		'/',
		'/members',
		'/products',
		'/transactions',
		'/savings',
		'/loans',
		'/shu',
		'/meetings',
		'/reports'
	];

	// Public routes (no authentication required)
	const publicRoutes = ['/login'];

	// Use $derived to reactively compute values
	const currentPath = $derived($page.url.pathname);
	// Check authentication by looking at the store state
	const isAuthenticated = $derived($authStore.isAuthenticated || !!$authStore.user);
	const isProtectedRoute = $derived(
		protectedRoutes.some((route) => currentPath.startsWith(route))
	);
	const isPublicRoute = $derived(publicRoutes.some((route) => currentPath.startsWith(route)));

	// Determine if we should show the app layout
	const showLayout = $derived(isAuthenticated && !isPublicRoute);

	// Handle redirects with $effect
	$effect(() => {
		// Only redirect if we're not already on the target page
		if (isProtectedRoute && !isAuthenticated && currentPath !== '/login') {
			goto('/login');
		} else if (isPublicRoute && isAuthenticated && currentPath === '/login') {
			goto('/');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Toast Notifications -->
<Toast />

{#if showLayout}
	<AppLayout>
		{@render children()}
	</AppLayout>
{:else}
	{@render children()}
{/if}
