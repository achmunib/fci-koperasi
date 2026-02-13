<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { loanService } from '$lib/services';
	import LoanDetail from '$lib/components/loan/LoanDetail.svelte';
	import LoanPaymentForm from '$lib/components/loan/LoanPaymentForm.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import { ArrowLeft, Plus, User } from 'lucide-svelte';
	import type { Loan, LoanPayment } from '$lib/types';

	const loanId = $derived($page.params.id);

	let loan = $state<Loan | null>(null);
	let payments = $state<LoanPayment[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let showPaymentModal = $state(false);
	let savingPayment = $state(false);
	let paymentError = $state<string | null>(null);

	onMount(async () => {
		await Promise.all([loadLoan(), loadPayments()]);
	});

	async function loadLoan() {
		loading = true;
		error = null;

		try {
			const response = await loanService.getLoan(loanId);
			if (response.success && response.data) {
				loan = response.data;
			} else {
				error = response.error || 'Gagal memuat data pinjaman';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat memuat data';
		} finally {
			loading = false;
		}
	}

	async function loadPayments() {
		try {
			const response = await loanService.getLoanPayments(loanId);
			if (response.success && response.data) {
				payments = response.data;
			}
		} catch (err) {
			// Silent fail
		}
	}

	function openPaymentModal() {
		paymentError = null;
		showPaymentModal = true;
	}

	function closePaymentModal() {
		showPaymentModal = false;
		paymentError = null;
	}

	async function handlePaymentSubmit(data: Partial<LoanPayment>) {
		savingPayment = true;
		paymentError = null;

		try {
			const response = await loanService.createPayment(loanId, data);
			if (response.success) {
				await Promise.all([loadLoan(), loadPayments()]);
				closePaymentModal();
			} else {
				paymentError = response.error || 'Gagal menyimpan pembayaran';
			}
		} catch (err) {
			paymentError = 'Terjadi kesalahan saat menyimpan pembayaran';
		} finally {
			savingPayment = false;
		}
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

		{#if loan}
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Detail Pinjaman</h1>
					<button
						type="button"
						onclick={() => goto(`/members/${loan.memberId}`)}
						class="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-1"
					>
						<User class="w-4 h-4" />
						{loan.memberName}
					</button>
				</div>
				{#if loan.status !== 'completed'}
					<Button variant="primary" onclick={openPaymentModal}>
						<Plus class="w-4 h-4 mr-2" />
						Tambah Pembayaran
					</Button>
				{/if}
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
	{:else if loan}
		<LoanDetail {loan} {payments} />
	{/if}
</div>

{#if loan}
	<Modal open={showPaymentModal} title="Tambah Pembayaran" onclose={closePaymentModal}>
		<div class="space-y-4">
			{#if paymentError}
				<Alert type="error" message={paymentError} />
			{/if}

			<LoanPaymentForm
				{loan}
				onsubmit={handlePaymentSubmit}
				oncancel={closePaymentModal}
				loading={savingPayment}
			/>
		</div>
	</Modal>
{/if}
