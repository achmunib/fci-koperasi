<script lang="ts">
	import type { Member } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import {
		validateRequired,
		validateEmail,
		validatePhone,
		validateIdNumber
	} from '$lib/utils/validation';
	import { formatFieldErrors, hasFormErrors, resetFormErrors } from '$lib/utils/forms';

	interface Props {
		member?: Member | null;
		onsubmit: (data: Partial<Member>) => void | Promise<void>;
		oncancel: () => void;
		loading?: boolean;
	}

	let { member = null, onsubmit, oncancel, loading = false }: Props = $props();

	let formData = $state({
		name: member?.name || '',
		idNumber: member?.idNumber || '',
		address: member?.address || '',
		phone: member?.phone || '',
		email: member?.email || '',
		joinDate: member?.joinDate
			? new Date(member.joinDate).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0],
		status: member?.status || 'active'
	});

	let errors = $state<Record<string, string>>({});

	const statusOptions = [
		{ value: 'active', label: 'Aktif' },
		{ value: 'inactive', label: 'Tidak Aktif' },
		{ value: 'suspended', label: 'Ditangguhkan' }
	];

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.name)) {
			newErrors.name = 'Nama wajib diisi';
		}

		if (!validateRequired(formData.idNumber)) {
			newErrors.idNumber = 'Nomor ID wajib diisi';
		} else if (!validateIdNumber(formData.idNumber)) {
			newErrors.idNumber = 'Format nomor ID tidak valid';
		}

		if (!validateRequired(formData.address)) {
			newErrors.address = 'Alamat wajib diisi';
		}

		if (!validateRequired(formData.phone)) {
			newErrors.phone = 'Nomor telepon wajib diisi';
		} else if (!validatePhone(formData.phone)) {
			newErrors.phone = 'Format nomor telepon tidak valid';
		}

		if (!validateRequired(formData.email)) {
			newErrors.email = 'Email wajib diisi';
		} else if (!validateEmail(formData.email)) {
			newErrors.email = 'Format email tidak valid';
		}

		if (!validateRequired(formData.joinDate)) {
			newErrors.joinDate = 'Tanggal bergabung wajib diisi';
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const submitData: Partial<Member> = {
			...formData,
			joinDate: new Date(formData.joinDate)
		};

		await onsubmit(submitData);
	}

</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Input
			label="Nama Lengkap"
			type="text"
			bind:value={formData.name}
			error={errors.name}
			required
			placeholder="Masukkan nama lengkap"
		/>

		<Input
			label="Nomor ID"
			type="text"
			bind:value={formData.idNumber}
			error={errors.idNumber}
			required
			placeholder="Masukkan nomor ID"
		/>

		<Input
			label="Email"
			type="email"
			bind:value={formData.email}
			error={errors.email}
			required
			placeholder="contoh@email.com"
		/>

		<Input
			label="Nomor Telepon"
			type="tel"
			bind:value={formData.phone}
			error={errors.phone}
			required
			placeholder="08xxxxxxxxxx"
		/>

		<div class="md:col-span-2">
			<Input
				label="Alamat"
				type="text"
				bind:value={formData.address}
				error={errors.address}
				required
				placeholder="Masukkan alamat lengkap"
			/>
		</div>

		<Input
			label="Tanggal Bergabung"
			type="date"
			bind:value={formData.joinDate}
			error={errors.joinDate}
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
			{member ? 'Perbarui' : 'Simpan'}
		</Button>
	</div>
</form>
