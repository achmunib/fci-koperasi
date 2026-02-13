<script lang="ts">
	import type { SHUMemberShare } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { validateRequired, validatePositiveNumber } from '$lib/utils/validation';
	import { hasFormErrors } from '$lib/utils/forms';
	import { formatIDR } from '$lib/utils/currency';

	interface Props {
		onsubmit: (params: SHUCalculationParams) => void | Promise<void>;
		loading?: boolean;
	}

	interface SHUCalculationParams {
		period: string;
		totalProfit: number;
		transactionWeight: number;
		savingsWeight: number;
	}

	let { onsubmit, loading = false }: Props = $props();

	let formData = $state({
		period: new Date().getFullYear().toString(),
		totalProfit: '',
		transactionWeight: '60',
		savingsWeight: '40'
	});

	let errors = $state<Record<string, string>>({});

	const totalWeight = $derived(
		parseFloat(formData.transactionWeight || '0') + parseFloat(formData.savingsWeight || '0')
	);

	const isWeightValid = $derived(totalWeight === 100);

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.period)) {
			newErrors.period = 'Periode wajib diisi';
		}

		if (!validateRequired(formData.totalProfit)) {
			newErrors.totalProfit = 'Total keuntungan wajib diisi';
		} else if (!validatePositiveNumber(parseFloat(formData.totalProfit))) {
			newErrors.totalProfit = 'Total keuntungan harus lebih dari 0';
		}

		if (!validateRequired(formData.transactionWeight)) {
			newErrors.transactionWeight = 'Bobot transaksi wajib diisi';
		} else if (parseFloat(formData.transactionWeight) < 0) {
			newErrors.transactionWeight = 'Bobot tidak boleh negatif';
		}

		if (!validateRequired(formData.savingsWeight)) {
			newErrors.savingsWeight = 'Bobot simpanan wajib diisi';
		} else if (parseFloat(formData.savingsWeight) < 0) {
			newErrors.savingsWeight = 'Bobot tidak boleh negatif';
		}

		if (!isWeightValid) {
			newErrors.transactionWeight = 'Total bobot harus 100%';
			newErrors.savingsWeight = 'Total bobot harus 100%';
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const params: SHUCalculationParams = {
			period: formData.period,
			totalProfit: parseFloat(formData.totalProfit),
			transactionWeight: parseFloat(formData.transactionWeight),
			savingsWeight: parseFloat(formData.savingsWeight)
		};

		await onsubmit(params);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
		<h3 class="font-semibold text-blue-900 mb-2">Tentang SHU</h3>
		<p class="text-sm text-blue-700">
			Sisa Hasil Usaha (SHU) adalah keuntungan koperasi yang dibagikan kepada anggota berdasarkan
			kontribusi mereka dalam transaksi dan simpanan.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Input
			label="Periode (Tahun)"
			type="text"
			bind:value={formData.period}
			error={errors.period}
			required
			placeholder="2024"
		/>

		<Input
			label="Total Keuntungan"
			type="number"
			bind:value={formData.totalProfit}
			error={errors.totalProfit}
			required
			placeholder="0"
		/>

		<Input
			label="Bobot Transaksi (%)"
			type="number"
			bind:value={formData.transactionWeight}
			error={errors.transactionWeight}
			required
			placeholder="60"
		/>

		<Input
			label="Bobot Simpanan (%)"
			type="number"
			bind:value={formData.savingsWeight}
			error={errors.savingsWeight}
			required
			placeholder="40"
		/>
	</div>

	<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
		<div class="flex justify-between items-center">
			<span class="text-sm font-medium text-gray-700">Total Bobot:</span>
			<span class="text-lg font-bold {isWeightValid ? 'text-green-600' : 'text-red-600'}">
				{totalWeight}%
			</span>
		</div>
		{#if !isWeightValid}
			<p class="text-sm text-red-600 mt-2">Total bobot harus 100%</p>
		{/if}
	</div>

	<div class="flex gap-3 justify-end pt-4 border-t">
		<Button type="submit" variant="primary" {loading} disabled={!isWeightValid}>
			Hitung SHU
		</Button>
	</div>
</form>
