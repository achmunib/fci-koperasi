<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { memberStore, filteredMembers } from '$lib/stores/members';
	import { memberService } from '$lib/services';
	import MemberList from '$lib/components/member/MemberList.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import { Plus, Search } from 'lucide-svelte';
	import type { Member } from '$lib/types';

	let searchQuery = $state('');
	let statusFilter = $state<'all' | 'active' | 'inactive' | 'suspended'>('all');
	let showDeleteModal = $state(false);
	let memberToDelete = $state<Member | null>(null);
	let deleteError = $state<string | null>(null);
	let deleting = $state(false);

	const members = $derived($filteredMembers);
	const loading = $derived($memberStore.loading);
	const error = $derived($memberStore.error);

	const statusOptions = [
		{ value: 'all', label: 'Semua Status' },
		{ value: 'active', label: 'Aktif' },
		{ value: 'inactive', label: 'Tidak Aktif' },
		{ value: 'suspended', label: 'Ditangguhkan' }
	];

	onMount(async () => {
		await loadMembers();
	});

	async function loadMembers() {
		memberStore.setLoading(true);
		memberStore.setError(null);

		try {
			const response = await memberService.getMembers();
			if (response.success && response.data) {
				memberStore.setMembers(response.data);
			} else {
				memberStore.setError(response.error || 'Gagal memuat data anggota');
			}
		} catch (err) {
			memberStore.setError('Terjadi kesalahan saat memuat data');
		} finally {
			memberStore.setLoading(false);
		}
	}

	function handleSearch() {
		memberStore.setSearchQuery(searchQuery);
	}

	function handleStatusFilter() {
		memberStore.setStatusFilter(statusFilter);
	}

	function handleView(member: Member) {
		goto(`/members/${member.id}`);
	}

	function handleEdit(member: Member) {
		goto(`/members/${member.id}/edit`);
	}

	function handleDeleteClick(member: Member) {
		memberToDelete = member;
		deleteError = null;
		showDeleteModal = true;
	}

	async function confirmDelete() {
		if (!memberToDelete) return;

		deleting = true;
		deleteError = null;

		try {
			const response = await memberService.deleteMember(memberToDelete.id);
			if (response.success) {
				memberStore.removeMember(memberToDelete.id);
				showDeleteModal = false;
				memberToDelete = null;
			} else {
				deleteError = response.error || 'Gagal menghapus anggota';
			}
		} catch (err) {
			deleteError = 'Terjadi kesalahan saat menghapus anggota';
		} finally {
			deleting = false;
		}
	}

	function cancelDelete() {
		showDeleteModal = false;
		memberToDelete = null;
		deleteError = null;
	}

	$effect(() => {
		handleSearch();
	});

	$effect(() => {
		handleStatusFilter();
	});

</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Manajemen Anggota</h1>
			<p class="text-gray-600 mt-1">Kelola data anggota koperasi</p>
		</div>
		<Button variant="primary" onclick={() => goto('/members/new')}>
			<Plus class="w-4 h-4 mr-2" />
			Tambah Anggota
		</Button>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<div class="bg-white rounded-lg shadow p-6">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			<div class="md:col-span-2">
				<Input
					type="text"
					placeholder="Cari nama, ID, email, atau telepon..."
					bind:value={searchQuery}
				>
					<Search class="w-5 h-5 text-gray-400" slot="icon" />
				</Input>
			</div>
			<Select options={statusOptions} bind:value={statusFilter} />
		</div>

		{#if loading}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat data...</p>
			</div>
		{:else}
			<MemberList
				{members}
				onview={handleView}
				onedit={handleEdit}
				ondelete={handleDeleteClick}
			/>
		{/if}
	</div>
</div>

<Modal open={showDeleteModal} title="Konfirmasi Hapus" onclose={cancelDelete}>
	<div class="space-y-4">
		{#if deleteError}
			<Alert type="error" message={deleteError} />
		{/if}

		<p class="text-gray-700">
			Apakah Anda yakin ingin menghapus anggota <strong>{memberToDelete?.name}</strong>?
		</p>
		<p class="text-sm text-gray-600">
			Anggota dengan transaksi aktif, produk, pinjaman, atau simpanan tidak dapat dihapus.
		</p>
	</div>

	<div slot="footer" class="flex gap-3 justify-end">
		<Button variant="secondary" onclick={cancelDelete} disabled={deleting}>
			Batal
		</Button>
		<Button variant="danger" onclick={confirmDelete} loading={deleting}>
			Hapus
		</Button>
	</div>
</Modal>
