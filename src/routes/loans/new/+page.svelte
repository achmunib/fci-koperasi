<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loanService, memberService } from '$lib/services';
	import LoanForm from '$lib/components/loan/LoanForm.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { Loan, Member } from '$lib/types';

	let members = $state<Member[]>([]);
	let loading = $state(false);
	let loadingData = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		await loadMembers();
	});

	async function loadMembers() {
		loadingData = true;
		try {
			const response = await memberService.getMembers();
			if (response.success && response.data) {
				members = response.data;
			}
		} catch (err) {
			// Silent fail
		} finally {
			loadingData = false;
		}
	}

	async function handleSubmit(data: Partial<Loan>) {
		loading = true;
		error = null;

		try {
			const response = await loanService.createLoan(data);
			if (response.success && response.data) {
				goto('/loans');
			} else {
				error = response.error || 'Gagal menambahkan pinjaman';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat menambahkan pinjaman';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto('/loans');
	}
</script>

<div class="space-y-6">
	<div>
		<button
			type="button"
			onclick={() => goto('/loans')}
			class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
		>
			<ArrowLeft class="w-4 h-4 mr-2" />
			Kembali ke Daftar Pinjaman
		</button>
		<h1 class="text-2xl font-bold text-gray-900">Tambah Pinjaman Baru</h1>
		<p class="text-gray-600 mt-1">Lengkapi formulir untuk menambahkan pinjaman baru</p>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		{#if loadingData}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else}
			<LoanForm {members} onsubmit={handleSubmit} oncancel={handleCancel} {loading} />
		{/if}
	</div>
</div>
