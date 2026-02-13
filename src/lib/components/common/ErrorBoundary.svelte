<script lang="ts">
	import { AlertTriangle, RefreshCw } from 'lucide-svelte';
	import Button from './Button.svelte';

	interface Props {
		error?: Error | string | null;
		onretry?: () => void;
		children?: any;
	}

	let { error = null, onretry, children }: Props = $props();

	const errorMessage = $derived(
		error instanceof Error ? error.message : error || 'Terjadi kesalahan yang tidak terduga'
	);
</script>

{#if error}
	<div class="flex flex-col items-center justify-center py-12 px-4">
		<div class="p-4 bg-red-100 rounded-full mb-4">
			<AlertTriangle class="w-12 h-12 text-red-600" />
		</div>
		<h3 class="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
		<p class="text-sm text-gray-600 text-center mb-6 max-w-md">{errorMessage}</p>
		{#if onretry}
			<Button variant="primary" onclick={onretry}>
				<RefreshCw class="w-4 h-4 mr-2" />
				Coba Lagi
			</Button>
		{/if}
	</div>
{:else}
	{@render children?.()}
{/if}
