<script lang="ts">
	interface SelectOption {
		value: string | number;
		label: string;
	}

	interface Props {
		label?: string;
		options: SelectOption[];
		value?: string | number;
		error?: string;
		required?: boolean;
		placeholder?: string;
		disabled?: boolean;
		name?: string;
		id?: string;
		onchange?: (event: Event) => void;
		class?: string;
	}

	let {
		label,
		options,
		value = $bindable(''),
		error,
		required = false,
		placeholder = 'Pilih opsi...',
		disabled = false,
		name,
		id,
		onchange,
		class: className = ''
	}: Props = $props();

	const selectId = $derived(id || name || `select-${Math.random().toString(36).substr(2, 9)}`);

	const baseClasses =
		'block w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed';

	const errorClasses = $derived(
		error
			? 'border-red-500 focus:border-red-500 focus:ring-red-500'
			: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
	);

	const classes = $derived(`${baseClasses} ${errorClasses} ${className}`);
</script>

<div class="w-full">
	{#if label}
		<label for={selectId} class="mb-1 block text-sm font-medium text-gray-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<select
		id={selectId}
		{name}
		bind:value
		{disabled}
		{required}
		class={classes}
		onchange={onchange}
	>
		{#if placeholder}
			<option value="" disabled selected={!value}>{placeholder}</option>
		{/if}

		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>

	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
