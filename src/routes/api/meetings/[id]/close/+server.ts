import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { meetings } from '../../_store';

export const POST: RequestHandler = async ({ params }) => {
	try {
		const meeting = meetings.find((m) => m.id === params.id);

		if (!meeting) {
			return json(
				{
					success: false,
					error: 'Rapat tidak ditemukan'
				},
				{ status: 404 }
			);
		}

		if (meeting.status === 'completed') {
			return json(
				{
					success: false,
					error: 'Rapat sudah ditutup'
				},
				{ status: 400 }
			);
		}

		// Close the meeting
		meeting.status = 'completed';
		meeting.updatedAt = new Date();

		return json({
			success: true,
			data: meeting,
			message: 'Rapat berhasil ditutup'
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: 'Gagal menutup rapat'
			},
			{ status: 400 }
		);
	}
};
