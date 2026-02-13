<script lang="ts">
	import type { SavingsTransaction, Member } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { validateRequired, validatePositiveNumber } from '$lib/utils/validation';
	import { hasFormErrors } from '$lib/utils/forms';
	import { formatIDR } from '$lib/utils/currency';

	interface Props {
		members: Member[];
		memberBalances?: Map<string, number>;
		onsubmit: (data: Partial<SavingsTransaction>) => void | Promise<void>;
		oncancel: () => void;
		loading?: boolean;
	}

	let { members, memberBalances, onsubmit, oncancel, loading = false }: Props = $props();

	let formData = $state({
		memberId: '',
		type: 'deposit' as 'deposit' | 'withdrawal',
		amount: '',
		date: new Date().toISOString().split('T')[0],
		notes: ''
	});

	let errors = $state<Record<string, string>>({});

	const memberOptions = $derived([
		{ value: '', label: 'Pilih Anggota' },
		...members
			.filter((m) => m.status === 'active')
			.map((m) => ({ value: m.id, label: m.name }))
	]);

	const typeOptions = [
		{ value: 'deposit', label: 'Setoran' },
		{ value: 'withdrawal', label: 'Penarikan' }
	];

	const selectedMemberBalance = $derived(() => {
		if (!formData.memberId || !memberBalances) return 0;
		return memberBalances.get(formData.memberId) || 0;
	});

	const isWithdrawalValid = $derived(() => {
		if (formData.type !== 'withdrawal') return true;
		const amount = parseFloat(formData.amount) || 0;
		return amount <= selectedMemberBalance();
	});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.date)) {
			newErrors.date = 'Tanggal wajib diisi';
		}

		if (!validateRequired(formData.memberId)) {
			newErrors.memberId = 'Anggota wajib dipilih';
		}

		if (!validateRequired(formData.amount)) {
			newErrors.amount = 'Jumlah wajib diisi';
		} else if (!validatePositiveNumber(parseFloat(formData.amount))) {
			newErrors.amount = 'Jumlah harus lebih dari 0';
		} else if (formData.type === 'withdrawal' && !isWithdrawalValid()) {
			newErrors.amount = `Saldo tidak mencukupi. Saldo saat ini: ${formatIDR(selectedMemberBalance())}`;
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const submitData: Partial<SavingsTransaction> = {
			memberId: formData.memberId,
			type: formData.type,
			amount: parseFloat(formData.amount),
			date: new Date(formData.date),
			notes: formData.notes || undefined
		};

		await onsubmit(submitData);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Input
			label="Tanggal"
			type="date"
			bind:value={formData.date}
			error={errors.date}
			required
		/>

		<Select
			label="Jenis Transaksi"
			options={typeOptions}
			bind:value={formData.type}
			error={errors.type}
			required
		/>

		<Select
			label="Anggota"
			options={memberOptions}
			bind:value={formData.memberId}
			error={errors.memberId}
			required
		/>

		<Input
			label="Jumlah"
			type="number"
			bind:value={formData.amount}
			error={errors.amount}
			required
			placeholder="0"
		/>

		{#if formData.memberId && memberBalances}
			<div class="md:col-span-2">
				<Alert
					type={formData.type === 'withdrawal' && !isWithdrawalValid() ? 'error' : 'info'}
					message="Saldo saat ini: {formatIDR(selectedMemberBalance())}"
				/>
			</div>
		{/if}

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

	<div class="flex gap-3 justify-end pt-4 border-t">
		<Button type="button" variant="secondary" onclick={oncancel} disabled={loading}>
			Batal
		</Button>
		<Button type="submit" variant="primary" {loading}>
			Simpan
		</Button>
	</div>
</form>
