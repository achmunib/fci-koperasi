import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Meeting, UpdateMeetingDto } from '$lib/types';
import { meetings } from '../_store';

export const GET: RequestHandler = async ({ params }) => {
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

	return json({
		success: true,
		data: meeting
	});
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const data: UpdateMeetingDto = await request.json();
		const index = meetings.findIndex((m) => m.id === params.id);

		if (index === -1) {
			return json(
				{
					success: false,
					error: 'Rapat tidak ditemukan'
				},
				{ status: 404 }
			);
		}

		const meeting = meetings[index];

		// Check if meeting is completed
		if (meeting.status === 'completed') {
			return json(
				{
					success: false,
					error: 'Rapat yang sudah selesai tidak dapat diubah'
				},
				{ status: 400 }
			);
		}

		// Update meeting
		meetings[index] = {
			...meeting,
			...data,
			date: data.date ? new Date(data.date) : meeting.date,
			updatedAt: new Date()
		};

		return json({
			success: true,
			data: meetings[index],
			message: 'Rapat berhasil diperbarui'
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: 'Gagal memperbarui rapat'
			},
			{ status: 400 }
		);
	}
};
