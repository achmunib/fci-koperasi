<script lang="ts">
	import { goto } from '$app/navigation';
	import { ReportSelector } from '$lib/components/report';

	function handleSelectReport(reportType: 'personal' | 'cooperative') {
		goto(`/reports/${reportType}`);
	}
</script>

<svelte:head>
	<title>Laporan Keuangan - Koperasi Produsen</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-4 sm:space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
		<p class="text-sm sm:text-base text-gray-600 mt-1">
			Pilih jenis laporan yang ingin Anda lihat
		</p>
	</div>

	<!-- Report Selector -->
	<ReportSelector onselect={handleSelectReport} />
</div>
