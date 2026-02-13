<script lang="ts">
	import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-svelte';

	interface Props {
		type?: 'success' | 'error' | 'warning' | 'info';
		message: string;
		dismissible?: boolean;
		ondismiss?: () => void;
		class?: string;
	}

	let {
		type = 'info',
		message,
		dismissible = false,
		ondismiss,
		class: className = ''
	}: Props = $props();

	const typeConfig = {
		success: {
			bgColor: 'bg-green-50',
			textColor: 'text-green-800',
			iconColor: 'text-green-400',
			icon: CheckCircle
		},
		error: {
			bgColor: 'bg-red-50',
			textColor: 'text-red-800',
			iconColor: 'text-red-400',
			icon: XCircle
		},
		warning: {
			bgColor: 'bg-yellow-50',
			textColor: 'text-yellow-800',
			iconColor: 'text-yellow-400',
			icon: AlertTriangle
		},
		info: {
			bgColor: 'bg-blue-50',
			textColor: 'text-blue-800',
			iconColor: 'text-blue-400',
			icon: Info
		}
	};

	const config = $derived(typeConfig[type]);
	const Icon = $derived(config.icon);
</script>

<div class="rounded-lg p-4 {config.bgColor} {className}" role="alert">
	<div class="flex items-start">
		<div class="flex-shrink-0">
			<Icon class="h-5 w-5 {config.iconColor}" />
		</div>
		<div class="ml-3 flex-1">
			<p class="text-sm {config.textColor}">{message}</p>
		</div>
		{#if dismissible}
			<div class="ml-auto pl-3">
				<button
					type="button"
					onclick={ondismiss}
					class="inline-flex rounded-lg p-1.5 {config.textColor} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2"
					aria-label="Tutup"
				>
					<X class="h-4 w-4" />
				</button>
			</div>
		{/if}
	</div>
</div>
