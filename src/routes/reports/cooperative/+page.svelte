<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { CooperativeReport as CooperativeReportType, DateRange } from '$lib/types';
	import { reportService } from '$lib/services';
	import { CooperativeReport } from '$lib/components/report';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import { ArrowLeft, Download } from 'lucide-svelte';

	let report = $state<CooperativeReportType | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let exporting = $state(false);

	// Default to last 30 days
	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(today.getDate() - 30);

	let dateRange = $state<DateRange>({
		startDate: thirtyDaysAgo,
		endDate: today
	});

	let startDateStr = $state(thirtyDaysAgo.toISOString().split('T')[0]);
	let endDateStr = $state(today.toISOString().split('T')[0]);

	async function loadReport() {
		try {
			loading = true;
			error = null;
			report = await reportService.getCooperativeReport(dateRange);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat laporan';
			console.error('Error loading cooperative report:', err);
		} finally {
			loading = false;
		}
	}

	function handleDateChange() {
		dateRange = {
			startDate: new Date(startDateStr),
			endDate: new Date(endDateStr)
		};
		loadReport();
	}

	async function handleExport(format: 'pdf' | 'csv') {
		try {
			exporting = true;
			const blob = await reportService.exportReport('cooperative', format, {
				dateRange
			});

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `laporan-koperasi-${Date.now()}.${format}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal mengekspor laporan';
			console.error('Error exporting report:', err);
		} finally {
			exporting = false;
		}
	}

	function handleBack() {
		goto('/reports');
	}

	onMount(() => {
		loadReport();
	});
</script>

<div class="max-w-7xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<button
				type="button"
				onclick={handleBack}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
			>
				<ArrowLeft class="w-6 h-6 text-gray-600" />
			</button>
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Laporan Koperasi</h1>
				<p class="text-gray-600 mt-1">Laporan keuangan koperasi secara keseluruhan</p>
			</div>
		</div>
		<div class="flex gap-3">
			<Button variant="secondary" onclick={() => handleExport('csv')} disabled={exporting || !report}>
				<Download class="w-4 h-4 mr-2" />
				Export CSV
			</Button>
			<Button variant="primary" onclick={() => handleExport('pdf')} disabled={exporting || !report}>
				<Download class="w-4 h-4 mr-2" />
				Export PDF
			</Button>
		</div>
	</div>

	<!-- Date Range Filter -->
	<div class="bg-white rounded-lg shadow p-6">
		<h3 class="font-semibold text-gray-900 mb-4">Filter Periode</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<Input
				label="Tanggal Mulai"
				type="date"
				bind:value={startDateStr}
				onchange={handleDateChange}
			/>
			<Input
				label="Tanggal Akhir"
				type="date"
				bind:value={endDateStr}
				onchange={handleDateChange}
			/>
			<div class="flex items-end">
				<Button variant="primary" onclick={handleDateChange} class="w-full">
					Terapkan Filter
				</Button>
			</div>
		</div>
	</div>

	<!-- Error Alert -->
	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<!-- Loading State -->
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else if report}
		<!-- Report Content -->
		<CooperativeReport {report} />
	{/if}
</div>
