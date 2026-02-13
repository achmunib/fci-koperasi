import { ApiService } from './api';
import type { Member, MemberFilters, CreateMemberDto, UpdateMemberDto } from '$lib/types';

class MemberService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Get all members with optional filters
	 */
	async getMembers(filters?: MemberFilters): Promise<Member[]> {
		const params = new URLSearchParams();
		if (filters?.search) params.append('search', filters.search);
		if (filters?.status) params.append('status', filters.status);

		const query = params.toString();
		const endpoint = query ? `/members?${query}` : '/members';

		const response = await this.get<Member[]>(endpoint);
		return response.data || [];
	}

	/**
	 * Get a single member by ID
	 */
	async getMember(id: string): Promise<Member> {
		const response = await this.get<Member>(`/members/${id}`);
		if (!response.data) {
			throw new Error('Anggota tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Create a new member
	 */
	async createMember(data: CreateMemberDto): Promise<Member> {
		const response = await this.post<Member>('/members', data);
		if (!response.data) {
			throw new Error('Gagal membuat anggota');
		}
		return response.data;
	}

	/**
	 * Update an existing member
	 */
	async updateMember(id: string, data: UpdateMemberDto): Promise<Member> {
		const response = await this.put<Member>(`/members/${id}`, data);
		if (!response.data) {
			throw new Error('Gagal memperbarui anggota');
		}
		return response.data;
	}

	/**
	 * Delete a member
	 */
	async deleteMember(id: string): Promise<void> {
		await this.delete(`/members/${id}`);
	}
}

export const memberService = new MemberService();
