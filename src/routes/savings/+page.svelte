<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { savingsService } from '$lib/services';
	import SavingsOverview from '$lib/components/savings/SavingsOverview.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import SavingsTransactionForm from '$lib/components/savings/SavingsTransactionForm.svelte';
	import { Plus } from 'lucide-svelte';
	import type { SavingsSummary, SavingsTransaction, Member } from '$lib/types';
	import { memberService } from '$lib/services';

	let summaries = $state<SavingsSummary[]>([]);
	let members = $state<Member[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let showTransactionModal = $state(false);
	let savingTransaction = $state(false);
	let transactionError = $state<string | null>(null);

	const memberBalances = $derived(() => {
		const balances = new Map<string, number>();
		summaries.forEach((s) => {
			balances.set(s.memberId, s.currentBalance);
		});
		return balances;
	});

	onMount(async () => {
		await Promise.all([loadSummaries(), loadMembers()]);
	});

	async function loadSummaries() {
		loading = true;
		error = null;

		try {
			const response = await savingsService.getSavingsSummary();
			if (response.success && response.data) {
				summaries = response.data;
			} else {
				error = response.error || 'Gagal memuat data simpanan';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat memuat data';
		} finally {
			loading = false;
		}
	}

	async function loadMembers() {
		try {
			const response = await memberService.getMembers();
			if (response.success && response.data) {
				members = response.data;
			}
		} catch (err) {
			// Silent fail
		}
	}

	function handleViewDetail(summary: SavingsSummary) {
		goto(`/savings/${summary.memberId}`);
	}

	function openTransactionModal() {
		transactionError = null;
		showTransactionModal = true;
	}

	function closeTransactionModal() {
		showTransactionModal = false;
		transactionError = null;
	}

	async function handleTransactionSubmit(data: Partial<SavingsTransaction>) {
		savingTransaction = true;
		transactionError = null;

		try {
			const response =
				data.type === 'deposit'
					? await savingsService.createDeposit(data)
					: await savingsService.createWithdrawal(data);

			if (response.success) {
				await loadSummaries();
				closeTransactionModal();
			} else {
				transactionError = response.error || 'Gagal menyimpan transaksi';
			}
		} catch (err) {
			transactionError = 'Terjadi kesalahan saat menyimpan transaksi';
		} finally {
			savingTransaction = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Manajemen Simpanan</h1>
			<p class="text-gray-600 mt-1">Kelola simpanan anggota koperasi</p>
		</div>
		<Button variant="primary" onclick={openTransactionModal}>
			<Plus class="w-4 h-4 mr-2" />
			Tambah Transaksi
		</Button>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="text-gray-600 mt-2">Memuat data...</p>
		</div>
	{:else}
		<SavingsOverview {summaries} onviewdetail={handleViewDetail} />
	{/if}
</div>

<Modal open={showTransactionModal} title="Tambah Transaksi Simpanan" onclose={closeTransactionModal}>
	<div class="space-y-4">
		{#if transactionError}
			<Alert type="error" message={transactionError} />
		{/if}

		<SavingsTransactionForm
			{members}
			memberBalances={memberBalances()}
			onsubmit={handleTransactionSubmit}
			oncancel={closeTransactionModal}
			loading={savingTransaction}
		/>
	</div>
</Modal>
