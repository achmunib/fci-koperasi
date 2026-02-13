<script lang="ts">
	import { onMount } from 'svelte';
	import { shuService } from '$lib/services';
	import SHUCalculator from '$lib/components/shu/SHUCalculator.svelte';
	import SHUDistributionList from '$lib/components/shu/SHUDistributionList.svelte';
	import Alert from '$lib/components/common/Alert.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import { formatIDR } from '$lib/utils/currency';
	import { formatDate } from '$lib/utils/date';
	import { History } from 'lucide-svelte';
	import type { SHUMemberShare, SHUDistribution } from '$lib/types';

	interface SHUCalculationParams {
		period: string;
		totalProfit: number;
		transactionWeight: number;
		savingsWeight: number;
	}

	let calculatedShares = $state<SHUMemberShare[]>([]);
	let calculationParams = $state<SHUCalculationParams | null>(null);
	let history = $state<SHUDistribution[]>([]);
	let calculating = $state(false);
	let distributing = $state(false);
	let loadingHistory = $state(true);
	let error = $state<string | null>(null);
	let distributionId = $state<string | null>(null);

	onMount(async () => {
		await loadHistory();
	});

	async function loadHistory() {
		loadingHistory = true;
		try {
			const response = await shuService.getSHUHistory();
			if (response.success && response.data) {
				history = response.data;
			}
		} catch (err) {
			// Silent fail
		} finally {
			loadingHistory = false;
		}
	}

	async function handleCalculate(params: SHUCalculationParams) {
		calculating = true;
		error = null;
		calculatedShares = [];

		try {
			const response = await shuService.calculateSHU(params);
			if (response.success && response.data) {
				calculatedShares = response.data;
				calculationParams = params;
			} else {
				error = response.error || 'Gagal menghitung SHU';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat menghitung SHU';
		} finally {
			calculating = false;
		}
	}

	async function handleDistribute() {
		if (!distributionId) return;

		distributing = true;
		error = null;

		try {
			const response = await shuService.distributeSHU(distributionId);
			if (response.success) {
				await loadHistory();
				calculatedShares = [];
				calculationParams = null;
				distributionId = null;
			} else {
				error = response.error || 'Gagal mendistribusikan SHU';
			}
		} catch (err) {
			error = 'Terjadi kesalahan saat mendistribusikan SHU';
		} finally {
			distributing = false;
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Distribusi SHU</h1>
		<p class="text-gray-600 mt-1">Hitung dan distribusikan Sisa Hasil Usaha kepada anggota</p>
	</div>

	{#if error}
		<Alert type="error" message={error} />
	{/if}

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-1">
			<Card title="Parameter Perhitungan">
				<SHUCalculator onsubmit={handleCalculate} loading={calculating} />
			</Card>
		</div>

		<div class="lg:col-span-2">
			{#if calculatedShares.length > 0 && calculationParams}
				<SHUDistributionList
					shares={calculatedShares}
					totalProfit={calculationParams.totalProfit}
					period={calculationParams.period}
					onApprove={handleDistribute}
					approving={distributing}
				/>
			{:else}
				<div class="bg-white rounded-lg shadow p-12 text-center">
					<p class="text-gray-500">
						Masukkan parameter perhitungan dan klik "Hitung SHU" untuk melihat distribusi
					</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="bg-white rounded-lg shadow">
		<div class="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
			<History class="w-5 h-5 text-gray-600" />
			<h3 class="text-lg font-semibold text-gray-900">Riwayat Distribusi</h3>
		</div>

		{#if loadingHistory}
			<div class="p-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="text-gray-600 mt-2">Memuat riwayat...</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Periode
							</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Total Keuntungan
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Tanggal Distribusi
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#if history.length === 0}
							<tr>
								<td colspan="4" class="px-6 py-8 text-center text-gray-500">
									Belum ada riwayat distribusi
								</td>
							</tr>
						{:else}
							{#each history as dist (dist.id)}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">{dist.period}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right">
										<div class="text-sm font-semibold text-gray-900">{formatIDR(dist.totalProfit)}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-500">{formatDate(dist.distributionDate)}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if dist.status === 'distributed'}
											<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
												Didistribusikan
											</span>
										{:else}
											<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
												Dihitung
											</span>
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
