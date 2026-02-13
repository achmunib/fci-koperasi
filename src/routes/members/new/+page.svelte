<script lang="ts">
	import { goto } from '$app/navigation';
	import { memberStore } from '$lib/stores/members';
	import { memberService } from '$lib/services';
	import MemberForm from '$lib/components/member/MemberForm.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { Member } from '$lib/types';

	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit(data: Partial<Member>) {
		loading = true;
		error = null;

		try {
			const response = await memberService.createMember(data);
			if (response.success && response.data) {
				memberStore.addMember(response.data);
				goto('/members');
			} else {
				error = response.error || 'Gagal menambahkan anggota';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat menambahkan anggota';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto('/members');
	}
</script>

<div class="space-y-6">
	<div>
		<button
			type="button"
			onclick={() => goto('/members')}
			class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
		>
			<ArrowLeft class="w-4 h-4 mr-2" />
			Kembali ke Daftar Anggota
		</button>
		<h1 class="text-2xl font-bold text-gray-900">Tambah Anggota Baru</h1>
		<p class="text-gray-600 mt-1">Lengkapi formulir untuk menambahkan anggota baru</p>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		<MemberForm onsubmit={handleSubmit} oncancel={handleCancel} {loading} />
	</div>
</div>
