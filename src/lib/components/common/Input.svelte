<script lang="ts">
	interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'datetime-local';
		label?: string;
		value?: string | number;
		error?: string;
		required?: boolean;
		placeholder?: string;
		disabled?: boolean;
		name?: string;
		id?: string;
		oninput?: (event: Event) => void;
		onblur?: (event: FocusEvent) => void;
		onkeydown?: (event: KeyboardEvent) => void;
		class?: string;
	}

	let {
		type = 'text',
		label,
		value = $bindable(''),
		error,
		required = false,
		placeholder,
		disabled = false,
		name,
		id,
		oninput,
		onblur,
		onkeydown,
		class: className = ''
	}: Props = $props();

	const inputId = $derived(id || name || `input-${Math.random().toString(36).substr(2, 9)}`);

	const baseClasses =
		'block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed';

	const errorClasses = $derived(
		error
			? 'border-red-500 focus:border-red-500 focus:ring-red-500'
			: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
	);

	const classes = $derived(`${baseClasses} ${errorClasses} ${className}`);
</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="mb-1 block text-sm font-medium text-gray-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<input
		{type}
		id={inputId}
		{name}
		bind:value
		{placeholder}
		{disabled}
		{required}
		class={classes}
		oninput={oninput}
		onblur={onblur}
		onkeydown={onkeydown}
	/>

	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
