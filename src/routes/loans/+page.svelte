<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loanService, memberService } from '$lib/services';
	import LoanList from '$lib/components/loan/LoanList.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import { Plus, Wallet, AlertCircle } from 'lucide-svelte';
	import { formatIDR } from '$lib/utils/currency';
	import type { Loan, Member } from '$lib/types';

	let loans = $state<Loan[]>([]);
	let members = $state<Member[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let memberFilter = $state('all');
	let statusFilter = $state('all');

	const memberOptions = $derived([
		{ value: 'all', label: 'Semua Anggota' },
		...members.map((m) => ({ value: m.id, label: m.name }))
	]);

	const statusOptions = [
		{ value: 'all', label: 'Semua Status' },
		{ value: 'active', label: 'Aktif' },
		{ value: 'completed', label: 'Lunas' },
		{ value: 'overdue', label: 'Terlambat' }
	];

	const filteredLoans = $derived(() => {
		let filtered = loans;

		if (memberFilter !== 'all') {
			filtered = filtered.filter((l) => l.memberId === memberFilter);
		}

		if (statusFilter !== 'all') {
			filtered = filtered.filter((l) => l.status === statusFilter);
		}

		return filtered;
	});

	const totalOutstanding = $derived(filteredLoans().reduce((sum, l) => sum + l.outstandingBalance, 0));
	const totalLoans = $derived(filteredLoans().reduce((sum, l) => sum + l.amount, 0));
	const overdueCount = $derived(filteredLoans().filter((l) => l.status === 'overdue').length);

	onMount(async () => {
		await Promise.all([loadLoans(), loadMembers()]);
	});

	async function loadLoans() {
		loading = true;
		error = null;

		try {
			const response = await loanService.getLoans();
			if (response.success && response.data) {
				loans = response.data;
			} else {
				error = response.error || 'Gagal memuat data pinjaman';
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

	function handleView(loan: Loan) {
		goto(`/loans/${loan.id}`);
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Manajemen Pinjaman</h1>
			<p class="text-gray-600 mt-1">Kelola pinjaman anggota koperasi</p>
		</div>
		<Button variant="primary" onclick={() => goto('/loans/new')}>
			<Plus class="w-4 h-4 mr-2" />
			Tambah Pinjaman
		</Button>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	{#if !loading}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Total Pinjaman</p>
						<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(totalLoans)}</p>
					</div>
					<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
						<Wallet class="w-6 h-6 text-blue-600" />
					</div>
				</div>
			</Card>

			<Card>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Sisa Pinjaman</p>
						<p class="text-2xl font-bold text-gray-900 mt-1">{formatIDR(totalOutstanding)}</p>
					</div>
					<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
						<Wallet class="w-6 h-6 text-red-600" />
					</div>
				</div>
			</Card>

			<Card>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Pinjaman Terlambat</p>
						<p class="text-2xl font-bold text-gray-900 mt-1">{overdueCount}</p>
					</div>
					<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
						<AlertCircle class="w-6 h-6 text-orange-600" />
					</div>
				</div>
			</Card>
		</div>
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
			<Select
				label="Anggota"
				options={memberOptions}
				bind:value={memberFilter}
			/>

			<Select
				label="Status"
				options={statusOptions}
				bind:value={statusFilter}
			/>
		</div>

		{#if loading}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else}
			<LoanList loans={filteredLoans()} onview={handleView} />
		{/if}
	</div>
</div>
