<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { savingsService, memberService } from '$lib/services';
	import MemberSavingsDetail from '$lib/components/savings/MemberSavingsDetail.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import SavingsTransactionForm from '$lib/components/savings/SavingsTransactionForm.svelte';
	import { ArrowLeft, Plus } from 'lucide-svelte';
	import type { SavingsSummary, SavingsTransaction, Member } from '$lib/types';

	const memberId = $derived($page.params.memberId);

	let summary = $state<SavingsSummary | null>(null);
	let transactions = $state<SavingsTransaction[]>([]);
	let members = $state<Member[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let showTransactionModal = $state(false);
	let savingTransaction = $state(false);
	let transactionError = $state<string | null>(null);

	const memberBalances = $derived(() => {
		const balances = new Map<string, number>();
		if (summary) {
			balances.set(summary.memberId, summary.currentBalance);
		}
		return balances;
	});

	onMount(async () => {
		await Promise.all([loadMemberSavings(), loadTransactions(), loadMembers()]);
	});

	async function loadMemberSavings() {
		loading = true;
		error = null;

		try {
			const response = await savingsService.getMemberSavings(memberId);
			if (response.success && response.data) {
				summary = response.data;
			} else {
				error = response.error || 'Gagal memuat data simpanan';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat memuat data';
		} finally {
			loading = false;
		}
	}

	async function loadTransactions() {
		try {
			const response = await savingsService.getSavingsTransactions(memberId);
			if (response.success && response.data) {
				transactions = response.data;
			}
		} catch (err) {
			// Silent fail
		}
	}

	async function loadMembers() {
		try {
			const response = await memberService.getMembers();
			if (response.success && response.data) {
				members = response.data.filter((m) => m.id === memberId);
			}
		} catch (err) {
			// Silent fail
		}
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
				await Promise.all([loadMemberSavings(), loadTransactions()]);
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
	<div>
		<button
			type="button"
			onclick={() => goto('/savings')}
			class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
		>
			<ArrowLeft class="w-4 h-4 mr-2" />
			Kembali ke Daftar Simpanan
		</button>

		{#if summary}
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Simpanan {summary.memberName}</h1>
					<p class="text-gray-600 mt-1">Detail simpanan dan riwayat transaksi</p>
				</div>
				<Button variant="primary" onclick={openTransactionModal}>
					<Plus class="w-4 h-4 mr-2" />
					Tambah Transaksi
				</Button>
			</div>
		{/if}
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="text-gray-600 mt-2">Memuat data...</p>
		</div>
	{:else if summary}
		<MemberSavingsDetail {summary} {transactions} />
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
