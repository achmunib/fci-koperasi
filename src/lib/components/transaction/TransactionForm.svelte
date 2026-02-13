<script lang="ts">
	import type { Transaction, Member, Product } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { validateRequired, validatePositiveNumber } from '$lib/utils/validation';
	import { hasFormErrors } from '$lib/utils/forms';
	import { formatIDR } from '$lib/utils/currency';

	interface Props {
		transaction?: Transaction | null;
		members: Member[];
		products: Product[];
		onsubmit: (data: Partial<Transaction>) => void | Promise<void>;
		oncancel: () => void;
		loading?: boolean;
	}

	let { transaction = null, members, products, onsubmit, oncancel, loading = false }: Props = $props();

	let formData = $state({
		date: transaction?.date
			? new Date(transaction.date).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0],
		memberId: transaction?.memberId || '',
		productId: transaction?.productId || '',
		quantity: transaction?.quantity?.toString() || '',
		pricePerUnit: transaction?.pricePerUnit?.toString() || '',
		notes: transaction?.notes || ''
	});

	let errors = $state<Record<string, string>>({});

	const memberOptions = $derived([
		{ value: '', label: 'Pilih Anggota' },
		...members
			.filter((m) => m.status === 'active')
			.map((m) => ({ value: m.id, label: m.name }))
	]);

	const productOptions = $derived([
		{ value: '', label: 'Pilih Produk' },
		...products
			.filter((p) => p.status === 'available')
			.map((p) => ({ value: p.id, label: `${p.name} - ${p.producerName}` }))
	]);

	const selectedProduct = $derived(
		products.find((p) => p.id === formData.productId)
	);

	const calculatedTotal = $derived(() => {
		const quantity = parseFloat(formData.quantity) || 0;
		const price = parseFloat(formData.pricePerUnit) || 0;
		return quantity * price;
	});

	// Auto-fill price when product is selected
	$effect(() => {
		if (selectedProduct && !transaction) {
			formData.pricePerUnit = selectedProduct.price.toString();
		}
	});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.date)) {
			newErrors.date = 'Tanggal wajib diisi';
		}

		if (!validateRequired(formData.memberId)) {
			newErrors.memberId = 'Anggota wajib dipilih';
		}

		if (!validateRequired(formData.productId)) {
			newErrors.productId = 'Produk wajib dipilih';
		}

		if (!validateRequired(formData.quantity)) {
			newErrors.quantity = 'Jumlah wajib diisi';
		} else if (!validatePositiveNumber(parseFloat(formData.quantity))) {
			newErrors.quantity = 'Jumlah harus lebih dari 0';
		}

		if (!validateRequired(formData.pricePerUnit)) {
			newErrors.pricePerUnit = 'Harga wajib diisi';
		} else if (!validatePositiveNumber(parseFloat(formData.pricePerUnit))) {
			newErrors.pricePerUnit = 'Harga harus lebih dari 0';
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const submitData: Partial<Transaction> = {
			date: new Date(formData.date),
			memberId: formData.memberId,
			productId: formData.productId,
			quantity: parseFloat(formData.quantity),
			pricePerUnit: parseFloat(formData.pricePerUnit),
			total: calculatedTotal(),
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
			label="Anggota"
			options={memberOptions}
			bind:value={formData.memberId}
			error={errors.memberId}
			required
		/>

		<Select
			label="Produk"
			options={productOptions}
			bind:value={formData.productId}
			error={errors.productId}
			required
		/>

		<Input
			label="Jumlah"
			type="number"
			bind:value={formData.quantity}
			error={errors.quantity}
			required
			placeholder="0"
		/>

		<Input
			label="Harga per Unit"
			type="number"
			bind:value={formData.pricePerUnit}
			error={errors.pricePerUnit}
			required
			placeholder="0"
		/>

		<div class="flex items-end">
			<div class="w-full">
				<label class="block text-sm font-medium text-gray-700 mb-1">
					Total
				</label>
				<div class="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900">
					{formatIDR(calculatedTotal())}
				</div>
			</div>
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

	<div class="flex gap-3 justify-end pt-4 border-t">
		<Button type="button" variant="secondary" onclick={oncancel} disabled={loading}>
			Batal
		</Button>
		<Button type="submit" variant="primary" {loading}>
			{transaction ? 'Perbarui' : 'Simpan'}
		</Button>
	</div>
</form>
