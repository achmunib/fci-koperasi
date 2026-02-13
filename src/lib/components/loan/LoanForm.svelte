<script lang="ts">
	import type { Loan, Member } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { validateRequired, validatePositiveNumber } from '$lib/utils/validation';
	import { hasFormErrors } from '$lib/utils/forms';
	import { formatIDR } from '$lib/utils/currency';

	interface Props {
		loan?: Loan | null;
		members: Member[];
		onsubmit: (data: Partial<Loan>) => void | Promise<void>;
		oncancel: () => void;
		loading?: boolean;
	}

	let { loan = null, members, onsubmit, oncancel, loading = false }: Props = $props();

	let formData = $state({
		memberId: loan?.memberId || '',
		amount: loan?.amount?.toString() || '',
		interestRate: loan?.interestRate?.toString() || '2',
		termMonths: loan?.termMonths?.toString() || '12',
		startDate: loan?.startDate
			? new Date(loan.startDate).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0]
	});

	let errors = $state<Record<string, string>>({});

	const memberOptions = $derived([
		{ value: '', label: 'Pilih Anggota' },
		...members
			.filter((m) => m.status === 'active')
			.map((m) => ({ value: m.id, label: m.name }))
	]);

	const termOptions = [
		{ value: '6', label: '6 Bulan' },
		{ value: '12', label: '12 Bulan' },
		{ value: '18', label: '18 Bulan' },
		{ value: '24', label: '24 Bulan' },
		{ value: '36', label: '36 Bulan' }
	];

	const monthlyPayment = $derived(() => {
		const principal = parseFloat(formData.amount) || 0;
		const rate = (parseFloat(formData.interestRate) || 0) / 100 / 12;
		const term = parseInt(formData.termMonths) || 1;

		if (principal === 0 || rate === 0) {
			return principal / term;
		}

		// Calculate monthly payment using amortization formula
		const payment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
		return payment;
	});

	const totalPayment = $derived(() => {
		const term = parseInt(formData.termMonths) || 1;
		return monthlyPayment() * term;
	});

	const totalInterest = $derived(() => {
		const principal = parseFloat(formData.amount) || 0;
		return totalPayment() - principal;
	});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.memberId)) {
			newErrors.memberId = 'Anggota wajib dipilih';
		}

		if (!validateRequired(formData.amount)) {
			newErrors.amount = 'Jumlah pinjaman wajib diisi';
		} else if (!validatePositiveNumber(parseFloat(formData.amount))) {
			newErrors.amount = 'Jumlah harus lebih dari 0';
		}

		if (!validateRequired(formData.interestRate)) {
			newErrors.interestRate = 'Bunga wajib diisi';
		} else if (parseFloat(formData.interestRate) < 0) {
			newErrors.interestRate = 'Bunga tidak boleh negatif';
		}

		if (!validateRequired(formData.termMonths)) {
			newErrors.termMonths = 'Tenor wajib dipilih';
		}

		if (!validateRequired(formData.startDate)) {
			newErrors.startDate = 'Tanggal mulai wajib diisi';
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const submitData: Partial<Loan> = {
			memberId: formData.memberId,
			amount: parseFloat(formData.amount),
			interestRate: parseFloat(formData.interestRate),
			termMonths: parseInt(formData.termMonths),
			startDate: new Date(formData.startDate)
		};

		await onsubmit(submitData);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Select
			label="Anggota"
			options={memberOptions}
			bind:value={formData.memberId}
			error={errors.memberId}
			required
		/>

		<Input
			label="Jumlah Pinjaman"
			type="number"
			bind:value={formData.amount}
			error={errors.amount}
			required
			placeholder="0"
		/>

		<Input
			label="Bunga per Tahun (%)"
			type="number"
			bind:value={formData.interestRate}
			error={errors.interestRate}
			required
			placeholder="2"
		/>

		<Select
			label="Tenor"
			options={termOptions}
			bind:value={formData.termMonths}
			error={errors.termMonths}
			required
		/>

		<Input
			label="Tanggal Mulai"
			type="date"
			bind:value={formData.startDate}
			error={errors.startDate}
			required
		/>
	</div>

	{#if parseFloat(formData.amount) > 0}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<h4 class="font-semibold text-blue-900 mb-3">Rincian Pembayaran</h4>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
				<div>
					<p class="text-blue-700">Cicilan per Bulan</p>
					<p class="text-lg font-bold text-blue-900">{formatIDR(monthlyPayment())}</p>
				</div>
				<div>
					<p class="text-blue-700">Total Bunga</p>
					<p class="text-lg font-bold text-blue-900">{formatIDR(totalInterest())}</p>
				</div>
				<div>
					<p class="text-blue-700">Total Pembayaran</p>
					<p class="text-lg font-bold text-blue-900">{formatIDR(totalPayment())}</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex gap-3 justify-end pt-4 border-t">
		<Button type="button" variant="secondary" onclick={oncancel} disabled={loading}>
			Batal
		</Button>
		<Button type="submit" variant="primary" {loading}>
			{loan ? 'Perbarui' : 'Simpan'}
		</Button>
	</div>
</form>
