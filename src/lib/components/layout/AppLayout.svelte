<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Header from './Header.svelte';
	import { onMount } from 'svelte';

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();

	// Default to closed on mobile, open on desktop
	let sidebarOpen = $state(false);
	let isMobile = $state(true);

	onMount(() => {
		// Check if we're on mobile or desktop
		const checkMobile = () => {
			isMobile = window.innerWidth < 1024; // lg breakpoint
			// On desktop, keep sidebar open by default
			if (!isMobile && !sidebarOpen) {
				sidebarOpen = true;
			}
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		if (isMobile) {
			sidebarOpen = false;
		}
	}
</script>

<div class="flex h-screen overflow-hidden bg-gray-50">
	<!-- Sidebar -->
	<Sidebar bind:isOpen={sidebarOpen} onToggle={toggleSidebar} onClose={closeSidebar} />

	<!-- Main content area -->
	<div class="flex flex-1 flex-col overflow-hidden lg:ml-64">
		<!-- Header -->
		<Header />

		<!-- Page content -->
		<main class="flex-1 overflow-y-auto p-4 sm:p-6">
			{@render children?.()}
		</main>
	</div>
</div>
