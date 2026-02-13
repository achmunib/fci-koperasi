<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		message?: string;
	}

	let { size = 'md', message }: Props = $props();

	const sizeClasses = {
		sm: 'h-6 w-6',
		md: 'h-12 w-12',
		lg: 'h-16 w-16'
	};
</script>

<div class="flex flex-col items-center justify-center py-12">
	<div class="animate-spin rounded-full border-b-2 border-blue-600 {sizeClasses[size]}"></div>
	{#if message}
		<p class="mt-4 text-sm text-gray-600">{message}</p>
	{/if}
</div>
