<script lang="ts">
	interface Props {
		title?: string;
		subtitle?: string;
		class?: string;
		children?: any;
		actions?: any;
	}

	let { title, subtitle, class: className = '', children, actions }: Props = $props();
</script>

<div class="rounded-lg border border-gray-200 bg-white shadow-sm {className}">
	{#if title || subtitle || actions}
		<div
			class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4"
		>
			<div class="min-w-0 flex-1">
				{#if title}
					<h3 class="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h3>
				{/if}
				{#if subtitle}
					<p class="mt-1 text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
				{/if}
			</div>
			{#if actions}
				<div class="flex-shrink-0">
					{@render actions?.()}
				</div>
			{/if}
		</div>
	{/if}

	<div class="px-4 sm:px-6 py-3 sm:py-4">
		{@render children?.()}
	</div>
</div>
