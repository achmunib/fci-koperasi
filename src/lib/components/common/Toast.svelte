<script lang="ts">
	import { notificationStore } from '$lib/stores/notifications';
	import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	const notifications = $derived($notificationStore.notifications);

	const icons = {
		success: CheckCircle,
		error: XCircle,
		warning: AlertTriangle,
		info: Info
	};

	const colors = {
		success: 'bg-green-50 border-green-200 text-green-800',
		error: 'bg-red-50 border-red-200 text-red-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800'
	};

	const iconColors = {
		success: 'text-green-600',
		error: 'text-red-600',
		warning: 'text-yellow-600',
		info: 'text-blue-600'
	};

	function handleClose(id: string) {
		notificationStore.remove(id);
	}
</script>

<!-- Toast Container -->
<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
	{#each notifications as notification (notification.id)}
		<div
			transition:fly={{ x: 300, duration: 300 }}
			class="flex items-start gap-3 p-4 rounded-lg border shadow-lg {colors[notification.type]}"
		>
			<svelte:component this={icons[notification.type]} class="w-5 h-5 flex-shrink-0 {iconColors[notification.type]}" />
			<p class="flex-1 text-sm font-medium">{notification.message}</p>
			<button
				type="button"
				onclick={() => handleClose(notification.id)}
				class="flex-shrink-0 hover:opacity-70 transition-opacity"
			>
				<X class="w-4 h-4" />
			</button>
		</div>
	{/each}
</div>
