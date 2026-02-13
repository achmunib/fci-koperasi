import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { reportType, format, params } = await request.json();

		// In a real app, this would generate actual PDF/CSV files
		// For now, we'll return a mock response
		const mockContent = `Mock ${format.toUpperCase()} export for ${reportType} report`;
		const blob = new Blob([mockContent], {
			type: format === 'pdf' ? 'application/pdf' : 'text/csv'
		});

		return new Response(blob, {
			headers: {
				'Content-Type': format === 'pdf' ? 'application/pdf' : 'text/csv',
				'Content-Disposition': `attachment; filename="report.${format}"`
			}
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: 'Gagal mengekspor laporan'
			},
			{ status: 400 }
		);
	}
};
