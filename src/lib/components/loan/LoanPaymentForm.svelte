<script lang="ts">
	import type { LoanPayment, Loan } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { validateRequired, validatePositiveNumber } from '$lib/utils/validation';
	import { hasFormErrors } from '$lib/utils/forms';
	import { formatIDR } from '$lib/utils/currency';

	interface Props {
		loan: Loan;
		onsubmit: (data: Partial<LoanPayment>) => void | Promise<void>;
		oncancel: () => void;
		loading?: boolean;
	}

	let { loan, onsubmit, oncancel, loading = false }: Props = $props();

	let formData = $state({
		amount: '',
		date: new Date().toISOString().split('T')[0],
		notes: ''
	});

	let errors = $state<Record<string, string>>({});

	const isPaymentValid = $derived(() => {
		const amount = parseFloat(formData.amount) || 0;
		return amount > 0 && amount <= loan.outstandingBalance;
	});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.date)) {
			newErrors.date = 'Tanggal wajib diisi';
		}

		if (!validateRequired(formData.amount)) {
			newErrors.amount = 'Jumlah pembayaran wajib diisi';
		} else if (!validatePositiveNumber(parseFloat(formData.amount))) {
			newErrors.amount = 'Jumlah harus lebih dari 0';
		} else if (parseFloat(formData.amount) > loan.outstandingBalance) {
			newErrors.amount = `Jumlah melebihi sisa pinjaman (${formatIDR(loan.outstandingBalance)})`;
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const submitData: Partial<LoanPayment> = {
			loanId: loan.id,
			amount: parseFloat(formData.amount),
			date: new Date(formData.date),
			notes: formData.notes || undefined
		};

		await onsubmit(submitData);
	}

	function setFullPayment() {
		formData.amount = loan.outstandingBalance.toString();
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<Alert type="info" message="Sisa Pinjaman: {formatIDR(loan.outstandingBalance)}" />

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Input
			label="Tanggal Pembayaran"
			type="date"
			bind:value={formData.date}
			error={errors.date}
			required
		/>

		<div>
			<Input
				label="Jumlah Pembayaran"
				type="number"
				bind:value={formData.amount}
				error={errors.amount}
				required
				placeholder="0"
			/>
			<button
				type="button"
				onclick={setFullPayment}
				class="mt-2 text-sm text-blue-600 hover:text-blue-800"
			>
				Bayar Penuh
			</button>
		</div>

		<div class="md:col-span-2">
			<Input
				label="Catatan (Opsional)"
				type="text"
				bind:value={formData.notes}
				error={errors.notes}
				placeholder="Tambahkan catatan jika diperlukan"
			/>
		</div>
	</div>

	{#if formData.amount}
		<div class="bg-green-50 border border-green-200 rounded-lg p-4">
			<h4 class="font-semibold text-green-900 mb-2">Setelah Pembayaran</h4>
			<p class="text-sm text-green-700">
				Sisa Pinjaman: <span class="font-bold">{formatIDR(loan.outstandingBalance - (parseFloat(formData.amount) || 0))}</span>
			</p>
		</div>
	{/if}

	<div class="flex gap-3 justify-end pt-4 border-t">
		<Button type="button" variant="secondary" onclick={oncancel} disabled={loading}>
			Batal
		</Button>
		<Button type="submit" variant="primary" {loading}>
			Simpan Pembayaran
		</Button>
	</div>
</form>
