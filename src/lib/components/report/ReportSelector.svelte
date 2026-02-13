<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { FileText, Building2 } from 'lucide-svelte';

	interface Props {
		onselect: (reportType: 'personal' | 'cooperative') => void;
	}

	let { onselect }: Props = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
	<!-- Personal Report Card -->
	<Card>
		<div class="p-4 sm:p-6">
			<div class="flex items-center justify-center mb-4">
				<div class="p-3 sm:p-4 bg-blue-100 rounded-full">
					<FileText class="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
				</div>
			</div>
			<h3 class="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
				Laporan Personal
			</h3>
			<p class="text-xs sm:text-sm text-gray-600 text-center mb-6">
				Lihat laporan keuangan pribadi Anda termasuk transaksi, simpanan, pinjaman, dan SHU
			</p>
			<Button variant="primary" onclick={() => onselect('personal')} class="w-full">
				Lihat Laporan Personal
			</Button>
		</div>
	</Card>

	<!-- Cooperative Report Card -->
	<Card>
		<div class="p-4 sm:p-6">
			<div class="flex items-center justify-center mb-4">
				<div class="p-3 sm:p-4 bg-green-100 rounded-full">
					<Building2 class="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
				</div>
			</div>
			<h3 class="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
				Laporan Koperasi
			</h3>
			<p class="text-xs sm:text-sm text-gray-600 text-center mb-6">
				Lihat laporan keuangan koperasi secara keseluruhan dengan data agregat semua anggota
			</p>
			<Button variant="primary" onclick={() => onselect('cooperative')} class="w-full">
				Lihat Laporan Koperasi
			</Button>
		</div>
	</Card>
</div>
