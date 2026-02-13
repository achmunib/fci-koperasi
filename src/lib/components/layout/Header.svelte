<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { Button } from '$lib/components/common';
	import { LogOut, User } from 'lucide-svelte';

	// Use $derived to reactively get user from store
	const user = $derived($authStore.user);

	function handleLogout() {
		authStore.logout();
		goto('/login');
	}
</script>

<header class="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
	<div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-4">
		<!-- Spacer for mobile menu button -->
		<div class="w-10 lg:hidden"></div>

		<!-- User info and actions -->
		<div class="flex items-center gap-2 sm:gap-4 ml-auto">
			{#if user}
				<div class="flex items-center gap-2 text-sm">
					<User class="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
					<div class="hidden sm:block">
						<p class="font-medium text-gray-900 text-sm truncate max-w-[150px] lg:max-w-none">
							{user.name}
						</p>
						<p class="text-xs text-gray-500 capitalize">{user.role}</p>
					</div>
				</div>
			{/if}

			<Button variant="ghost" size="sm" onclick={handleLogout}>
				<LogOut class="h-4 w-4 sm:mr-2" />
				<span class="hidden sm:inline">Keluar</span>
			</Button>
		</div>
	</div>
</header>
