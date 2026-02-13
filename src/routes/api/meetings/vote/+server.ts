import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Vote } from '$lib/types';
import { meetings } from '../_store';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const vote: Vote = await request.json();
		const { meetingId, agendaItemId, memberId, choice } = vote;

		// Find the meeting
		const meeting = meetings.find((m) => m.id === meetingId);
		if (!meeting) {
			return json(
				{
					success: false,
					error: 'Rapat tidak ditemukan'
				},
				{ status: 404 }
			);
		}

		// Check if meeting is completed
		if (meeting.status === 'completed') {
			return json(
				{
					success: false,
					error: 'Voting tidak dapat dilakukan pada rapat yang sudah selesai'
				},
				{ status: 400 }
			);
		}

		// Find the agenda item
		const agendaItem = meeting.agendaItems.find((item: any) => item.id === agendaItemId);
		if (!agendaItem) {
			return json(
				{
					success: false,
					error: 'Agenda tidak ditemukan'
				},
				{ status: 404 }
			);
		}

		if (!agendaItem.requiresVote) {
			return json(
				{
					success: false,
					error: 'Agenda ini tidak memerlukan voting'
				},
				{ status: 400 }
			);
		}

		// Initialize vote results if not exists
		if (!agendaItem.voteResults) {
			agendaItem.voteResults = {
				approve: 0,
				reject: 0,
				abstain: 0,
				voters: []
			};
		}

		// Check if member has already voted
		const hasVoted = agendaItem.voteResults.voters.includes(memberId);

		if (hasVoted) {
			// Update existing vote (in a real app, we'd track individual votes)
			// For simplicity, we'll just prevent duplicate voting
			return json(
				{
					success: false,
					error: 'Anda sudah memberikan suara untuk agenda ini'
				},
				{ status: 400 }
			);
		}

		// Record the vote
		agendaItem.voteResults[choice]++;
		agendaItem.voteResults.voters.push(memberId);

		// Update meeting
		meeting.updatedAt = new Date();

		return json({
			success: true,
			data: agendaItem.voteResults,
			message: 'Suara berhasil disimpan'
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: 'Gagal menyimpan suara'
			},
			{ status: 400 }
		);
	}
};
