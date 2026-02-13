import { writable, derived } from 'svelte/store';
import type { Member } from '$lib/types';

interface MemberState {
	members: Member[];
	loading: boolean;
	error: string | null;
	searchQuery: string;
	statusFilter: 'all' | 'active' | 'inactive' | 'suspended';
}

const initialState: MemberState = {
	members: [],
	loading: false,
	error: null,
	searchQuery: '',
	statusFilter: 'all'
};

function createMemberStore() {
	const { subscribe, set, update } = writable<MemberState>(initialState);

	return {
		subscribe,
		setMembers: (members: Member[]) => update((state) => ({ ...state, members })),
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
		setError: (error: string | null) => update((state) => ({ ...state, error })),
		setSearchQuery: (query: string) => update((state) => ({ ...state, searchQuery: query })),
		setStatusFilter: (status: 'all' | 'active' | 'inactive' | 'suspended') =>
			update((state) => ({ ...state, statusFilter: status })),
		addMember: (member: Member) =>
			update((state) => ({ ...state, members: [member, ...state.members] })),
		updateMember: (id: string, updatedMember: Member) =>
			update((state) => ({
				...state,
				members: state.members.map((m) => (m.id === id ? updatedMember : m))
			})),
		removeMember: (id: string) =>
			update((state) => ({
				...state,
				members: state.members.filter((m) => m.id !== id)
			})),
		reset: () => set(initialState)
	};
}

export const memberStore = createMemberStore();

// Derived store for filtered members
export const filteredMembers = derived(memberStore, ($memberStore) => {
	let filtered = $memberStore.members;

	// Filter by status
	if ($memberStore.statusFilter !== 'all') {
		filtered = filtered.filter((m) => m.status === $memberStore.statusFilter);
	}

	// Filter by search query
	if ($memberStore.searchQuery) {
		const query = $memberStore.searchQuery.toLowerCase();
		filtered = filtered.filter(
			(m) =>
				m.name.toLowerCase().includes(query) ||
				m.idNumber.toLowerCase().includes(query) ||
				m.email.toLowerCase().includes(query) ||
				m.phone.includes(query)
		);
	}

	return filtered;
});
