import { ApiService } from './api';
import type {
	Meeting,
	MeetingFilters,
	CreateMeetingDto,
	UpdateMeetingDto,
	Vote,
	VoteResults
} from '$lib/types';

class MeetingService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Get all meetings with optional filters
	 */
	async getMeetings(filters?: MeetingFilters): Promise<Meeting[]> {
		const params = new URLSearchParams();
		if (filters?.status) params.append('status', filters.status);
		if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
		if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

		const query = params.toString();
		const endpoint = query ? `/meetings?${query}` : '/meetings';

		const response = await this.get<Meeting[]>(endpoint);
		return response.data || [];
	}

	/**
	 * Get a single meeting by ID
	 */
	async getMeeting(id: string): Promise<Meeting> {
		const response = await this.get<Meeting>(`/meetings/${id}`);
		if (!response.data) {
			throw new Error('Rapat tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Create a new meeting
	 */
	async createMeeting(data: CreateMeetingDto): Promise<Meeting> {
		const response = await this.post<Meeting>('/meetings', data);
		if (!response.data) {
			throw new Error('Gagal membuat rapat');
		}
		return response.data;
	}

	/**
	 * Update an existing meeting
	 */
	async updateMeeting(id: string, data: UpdateMeetingDto): Promise<Meeting> {
		const response = await this.put<Meeting>(`/meetings/${id}`, data);
		if (!response.data) {
			throw new Error('Gagal memperbarui rapat');
		}
		return response.data;
	}

	/**
	 * Record attendance for a meeting
	 */
	async recordAttendance(meetingId: string, memberIds: string[]): Promise<void> {
		await this.post(`/meetings/${meetingId}/attendance`, { memberIds });
	}

	/**
	 * Submit a vote for an agenda item
	 */
	async submitVote(vote: Vote): Promise<void> {
		await this.post('/meetings/vote', vote);
	}

	/**
	 * Get vote results for an agenda item
	 */
	async getVoteResults(meetingId: string, agendaItemId: string): Promise<VoteResults> {
		const response = await this.get<VoteResults>(
			`/meetings/${meetingId}/agenda/${agendaItemId}/results`
		);
		if (!response.data) {
			throw new Error('Hasil voting tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Close a meeting (finalize)
	 */
	async closeMeeting(meetingId: string): Promise<Meeting> {
		const response = await this.post<Meeting>(`/meetings/${meetingId}/close`);
		if (!response.data) {
			throw new Error('Gagal menutup rapat');
		}
		return response.data;
	}
}

export const meetingService = new MeetingService();
