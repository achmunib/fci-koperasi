<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { memberStore } from '$lib/stores/members';
	import { memberService } from '$lib/services';
	import MemberForm from '$lib/components/member/MemberForm.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { Member } from '$lib/types';

	const memberId = $derived($page.params.id);

	let member = $state<Member | null>(null);
	let loading = $state(true);
	let saving = $state(false);
	let error = $state<string | null>(null);

	onMount(async () => {
		await loadMember();
	});

	async function loadMember() {
		loading = true;
		error = null;

		try {
			const response = await memberService.getMember(memberId);
			if (response.success && response.data) {
				member = response.data;
			} else {
				error = response.error || 'Gagal memuat data anggota';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat memuat data';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit(data: Partial<Member>) {
		saving = true;
		error = null;

		try {
			const response = await memberService.updateMember(memberId, data);
			if (response.success && response.data) {
				memberStore.updateMember(memberId, response.data);
				goto(`/members/${memberId}`);
			} else {
				error = response.error || 'Gagal memperbarui anggota';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat memperbarui anggota';
		} finally {
			saving = false;
		}
	}

	function handleCancel() {
		goto(`/members/${memberId}`);
	}
</script>

<div class="space-y-6">
	<div>
		<button
			type="button"
			onclick={() => goto(`/members/${memberId}`)}
			class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
		>
			<ArrowLeft class="w-4 h-4 mr-2" />
			Kembali ke Detail Anggota
		</button>
		<h1 class="text-2xl font-bold text-gray-900">Edit Anggota</h1>
		<p class="text-gray-600 mt-1">Perbarui informasi anggota</p>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="text-gray-600 mt-2">Memuat data...</p>
		</div>
	{:else if member}
		<div class="bg-white rounded-lg shadow p-6">
			<MemberForm {member} onsubmit={handleSubmit} oncancel={handleCancel} loading={saving} />
		</div>
	{/if}
</div>
