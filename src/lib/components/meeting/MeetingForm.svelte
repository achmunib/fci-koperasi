<script lang="ts">
	import type { Meeting, AgendaItem } from '$lib/types';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { validateRequired } from '$lib/utils/validation';
	import { hasFormErrors } from '$lib/utils/forms';
	import { Plus, Trash2 } from 'lucide-svelte';

	interface Props {
		meeting?: Meeting | null;
		onsubmit: (data: Partial<Meeting>) => void | Promise<void>;
		oncancel: () => void;
		loading?: boolean;
	}

	let { meeting = null, onsubmit, oncancel, loading = false }: Props = $props();

	let formData = $state({
		title: meeting?.title || '',
		date: meeting?.date
			? new Date(meeting.date).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0],
		location: meeting?.location || '',
		status: meeting?.status || 'scheduled'
	});

	let agendaItems = $state<Array<{ title: string; description: string; requiresVote: boolean }>>(
		meeting?.agendaItems?.map((a) => ({
			title: a.title,
			description: a.description,
			requiresVote: a.requiresVote
		})) || [{ title: '', description: '', requiresVote: false }]
	);

	let errors = $state<Record<string, string>>({});

	const statusOptions = [
		{ value: 'scheduled', label: 'Terjadwal' },
		{ value: 'ongoing', label: 'Berlangsung' },
		{ value: 'completed', label: 'Selesai' }
	];

	function addAgendaItem() {
		agendaItems = [...agendaItems, { title: '', description: '', requiresVote: false }];
	}

	function removeAgendaItem(index: number) {
		agendaItems = agendaItems.filter((_, i) => i !== index);
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!validateRequired(formData.title)) {
			newErrors.title = 'Judul rapat wajib diisi';
		}

		if (!validateRequired(formData.date)) {
			newErrors.date = 'Tanggal wajib diisi';
		}

		if (!validateRequired(formData.location)) {
			newErrors.location = 'Lokasi wajib diisi';
		}

		if (agendaItems.length === 0) {
			newErrors.agenda = 'Minimal harus ada 1 agenda';
		} else {
			const hasEmptyAgenda = agendaItems.some((item) => !item.title.trim());
			if (hasEmptyAgenda) {
				newErrors.agenda = 'Semua agenda harus memiliki judul';
			}
		}

		errors = newErrors;
		return !hasFormErrors(newErrors);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		const submitData: Partial<Meeting> = {
			title: formData.title,
			date: new Date(formData.date),
			location: formData.location,
			status: formData.status as 'scheduled' | 'ongoing' | 'completed',
			agendaItems: agendaItems.map((item, index) => ({
				id: `agenda-${index}`,
				title: item.title,
				description: item.description,
				requiresVote: item.requiresVote
			}))
		};

		await onsubmit(submitData);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Input
			label="Judul Rapat"
			type="text"
			bind:value={formData.title}
			error={errors.title}
			required
			placeholder="Masukkan judul rapat"
		/>

		<Input
			label="Tanggal"
			type="date"
			bind:value={formData.date}
			error={errors.date}
			required
		/>

		<Input
			label="Lokasi"
			type="text"
			bind:value={formData.location}
			error={errors.location}
			required
			placeholder="Masukkan lokasi rapat"
		/>

		<Select
			label="Status"
			options={statusOptions}
			bind:value={formData.status}
			error={errors.status}
			required
		/>
	</div>

	<div class="border-t pt-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-gray-900">Agenda Rapat</h3>
			<Button type="button" variant="secondary" onclick={addAgendaItem}>
				<Plus class="w-4 h-4 mr-2" />
				Tambah Agenda
			</Button>
		</div>

		{#if errors.agenda}
			<p class="text-sm text-red-600 mb-4">{errors.agenda}</p>
		{/if}

		<div class="space-y-4">
			{#each agendaItems as item, index (index)}
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="flex items-start justify-between mb-3">
						<h4 class="font-medium text-gray-900">Agenda {index + 1}</h4>
						{#if agendaItems.length > 1}
							<button
								type="button"
								onclick={() => removeAgendaItem(index)}
								class="text-red-600 hover:text-red-800"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						{/if}
					</div>

					<div class="space-y-3">
						<Input
							label="Judul Agenda"
							type="text"
							bind:value={item.title}
							required
							placeholder="Masukkan judul agenda"
						/>

						<Input
							label="Deskripsi"
							type="text"
							bind:value={item.description}
							placeholder="Masukkan deskripsi (opsional)"
						/>

						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								id="vote-{index}"
								bind:checked={item.requiresVote}
								class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label for="vote-{index}" class="text-sm text-gray-700">
								Memerlukan voting
							</label>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex gap-3 justify-end pt-4 border-t">
		<Button type="button" variant="secondary" onclick={oncancel} disabled={loading}>
			Batal
		</Button>
		<Button type="submit" variant="primary" {loading}>
			{meeting ? 'Perbarui' : 'Simpan'}
		</Button>
	</div>
</form>
