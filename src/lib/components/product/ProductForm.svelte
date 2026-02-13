<script lang="ts">
	import type { Product, Member } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { validateRequired, validatePositiveNumber } from '$lib/utils/validation';
	import { hasFormErrors } from '$lib/utils/forms';

	interface Props {
		product?: Product | null;
		members: Member[];
		onsubmit: (data: Partial<Product>) => void | Promise<void>;
		oncancel: () => void;
		loading?: boolean;
	}

	let { product = null, members, onsubmit, oncancel, loading = false }: Props = $props();

	let formData = $state({
		name: product?.name || '',
		description: product?.description || '',
		category: product?.category || '',
		price: product?.price?.toString() || '',
		unit: product?.unit || '',
		producerId: product?.producerId || '',
		status: product?.status || 'available'
	});

	let errors = $state<Record<string, string>>({});

	const statusOptions = [
		{ value: 'available', label: 'Tersedia' },
		{ value: 'out_of_stock', label: 'Stok Habis' },
		{ value: 'discontinued', label: 'Dihentikan' }
	];

	const memberOptions = $derived([
		{ value: '', label: 'Pilih Produsen' },
		...members
			.filter((m) => m.status === 'active')
			.map((m) => ({ value: m.id, label: m.name }))
	]);

	const categoryOptions = [
		{ value: '', label: 'Pilih Kategori' },
		{ value: 'Sayuran', label: 'Sayuran' },
		{ value: 'Buah-buahan', label: 'Buah-buahan' },
		{ value: 'Hasil Ternak', label: 'Hasil Ternak' },
		{ value: 'Hasil Kebun', label: 'Hasil Kebun' },
		{ value: 'Kerajinan', label: 'Kerajinan' },
		{ value: 'Lainnya', label: 'Lainnya' }
	];

	const unitOptions = [
		{ value: '', label: 'Pilih Satuan' },
		{ value: 'kg', label: 'Kilogram (kg)' },
		{ value: 'gram', label: 'Gram' },
		{ value: 'liter', label: 'Liter' },
		{ value: 'pcs', label: 'Pieces (pcs)' },
		{ value: 'ikat', label: 'Ikat' },
		{ value: 'karung', label: 'Karung' },
		{ value: 'box', label: 'Box' }
	];

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.name)) {
			newErrors.name = 'Nama produk wajib diisi';
		}

		if (!validateRequired(formData.description)) {
			newErrors.description = 'Deskripsi wajib diisi';
		}

		if (!validateRequired(formData.category)) {
			newErrors.category = 'Kategori wajib dipilih';
		}

		if (!validateRequired(formData.price)) {
			newErrors.price = 'Harga wajib diisi';
		} else if (!validatePositiveNumber(parseFloat(formData.price))) {
			newErrors.price = 'Harga harus lebih dari 0';
		}

		if (!validateRequired(formData.unit)) {
			newErrors.unit = 'Satuan wajib dipilih';
		}

		if (!validateRequired(formData.producerId)) {
			newErrors.producerId = 'Produsen wajib dipilih';
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const submitData: Partial<Product> = {
			...formData,
			price: parseFloat(formData.price)
		};

		await onsubmit(submitData);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Input
			label="Nama Produk"
			type="text"
			bind:value={formData.name}
			error={errors.name}
			required
			placeholder="Masukkan nama produk"
		/>

		<Select
			label="Kategori"
			options={categoryOptions}
			bind:value={formData.category}
			error={errors.category}
			required
		/>

		<div class="md:col-span-2">
			<Input
				label="Deskripsi"
				type="text"
				bind:value={formData.description}
				error={errors.description}
				required
				placeholder="Masukkan deskripsi produk"
			/>
		</div>

		<Input
			label="Harga"
			type="number"
			bind:value={formData.price}
			error={errors.price}
			required
			placeholder="0"
		/>

		<Select
			label="Satuan"
			options={unitOptions}
			bind:value={formData.unit}
			error={errors.unit}
			required
		/>

		<Select
			label="Produsen"
			options={memberOptions}
			bind:value={formData.producerId}
			error={errors.producerId}
			required
		/>

		<Select
			label="Status"
			options={statusOptions}
			bind:value={formData.status}
			error={errors.status}
			required
		/>
	</div>

	<div class="flex gap-3 justify-end pt-4 border-t">
		<Button type="button" variant="secondary" onclick={oncancel} disabled={loading}>
			Batal
		</Button>
		<Button type="submit" variant="primary" {loading}>
			{product ? 'Perbarui' : 'Simpan'}
		</Button>
	</div>
</form>
