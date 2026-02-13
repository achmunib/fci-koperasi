/**
 * Format a number as Indonesian Rupiah (IDR) currency
 * @param amount - The numeric amount to format
 * @returns Formatted currency string (e.g., "Rp 1.000.000")
 */
export function formatIDR(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}
