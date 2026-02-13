import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Meeting, CreateMeetingDto } from '$lib/types';
import { meetings } from './_store';

export const GET: RequestHandler = async ({ url }) => {
	const status = url.searchParams.get('status');

	let filteredMeetings = [...meetings];

	if (status) {
		filteredMeetings = filteredMeetings.filter((m) => m.status === status);
	}

	// Sort by date descending
	filteredMeetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return json({
		success: true,
		data: filteredMeetings
	});
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: CreateMeetingDto = await request.json();

		const newMeeting: Meeting = {
			id: String(meetings.length + 1),
			title: data.title,
			date: new Date(data.date),
			location: data.location,
			status: 'scheduled',
			attendees: [],
			agendaItems: data.agendaItems.map((item, index) => ({
				id: `agenda-${index + 1}`,
				title: item.title,
				description: item.description,
				requiresVote: item.requiresVote,
				voteResults: item.requiresVote
					? {
							approve: 0,
							reject: 0,
							abstain: 0,
							voters: []
						}
					: undefined
			})),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		meetings.push(newMeeting);

		return json({
			success: true,
			data: newMeeting,
			message: 'Rapat berhasil dibuat'
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: 'Gagal membuat rapat'
			},
			{ status: 400 }
		);
	}
};
