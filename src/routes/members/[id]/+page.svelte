<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { memberService } from '$lib/services';
	import { formatDate } from '$lib/utils/date';
	import Button from '$lib/components/common/Button.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import { ArrowLeft, Edit, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-svelte';
	import type { Member } from '$lib/types';

	const memberId = $derived($page.params.id);

	let member = $state<Member | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const statusColors = {
		active: 'bg-green-100 text-green-800',
		inactive: 'bg-gray-100 text-gray-800',
		suspended: 'bg-red-100 text-red-800'
	};

	const statusLabels = {
		active: 'Aktif',
		inactive: 'Tidak Aktif',
		suspended: 'Ditangguhkan'
	};

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
		<div class="bg-white rounded-lg shadow">
			<div class="p-6 border-b border-gray-200">
				<div class="flex items-start justify-between">
					<div class="flex items-center gap-4">
						<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
							<User class="w-8 h-8 text-blue-600" />
						</div>
						<div>
							<h1 class="text-2xl font-bold text-gray-900">{member.name}</h1>
							<p class="text-gray-600">ID: {member.idNumber}</p>
						</div>
					</div>
					<div class="flex gap-3">
						<span class="px-3 py-1 rounded-full text-sm font-medium {statusColors[member.status]}">
							{statusLabels[member.status]}
						</span>
						<Button variant="primary" onclick={() => goto(`/members/${member.id}/edit`)}>
							<Edit class="w-4 h-4 mr-2" />
							Edit
						</Button>
					</div>
				</div>
			</div>

			<div class="p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Anggota</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="flex items-start gap-3">
						<Mail class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Email</p>
							<p class="text-gray-900">{member.email}</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<Phone class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Telepon</p>
							<p class="text-gray-900">{member.phone}</p>
						</div>
					</div>

					<div class="flex items-start gap-3 md:col-span-2">
						<MapPin class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Alamat</p>
							<p class="text-gray-900">{member.address}</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<Calendar class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Tanggal Bergabung</p>
							<p class="text-gray-900">{formatDate(member.joinDate)}</p>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<Shield class="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Status</p>
							<p class="text-gray-900">{statusLabels[member.status]}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card title="Total Transaksi">
				<div class="text-3xl font-bold text-gray-900">0</div>
				<p class="text-sm text-gray-600 mt-1">Belum ada transaksi</p>
			</Card>

			<Card title="Total Simpanan">
				<div class="text-3xl font-bold text-gray-900">Rp 0</div>
				<p class="text-sm text-gray-600 mt-1">Belum ada simpanan</p>
			</Card>

			<Card title="Total Pinjaman">
				<div class="text-3xl font-bold text-gray-900">Rp 0</div>
				<p class="text-sm text-gray-600 mt-1">Belum ada pinjaman</p>
			</Card>
		</div>
	{/if}
</div>
