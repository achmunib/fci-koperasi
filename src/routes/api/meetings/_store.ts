import type { Meeting } from '$lib/types';

// Mock data store (in a real app, this would be a database)
export let meetings: Meeting[] = [
	{
		id: '1',
		title: 'Rapat Anggota Tahunan 2024',
		date: new Date('2024-12-15T10:00:00'),
		location: 'Aula Koperasi',
		status: 'scheduled',
		attendees: [],
		agendaItems: [
			{
				id: 'agenda-1',
				title: 'Laporan Keuangan Tahun 2024',
				description: 'Presentasi laporan keuangan dan pembahasan',
				requiresVote: false
			},
			{
				id: 'agenda-2',
				title: 'Persetujuan Anggaran 2025',
				description: 'Voting untuk menyetujui anggaran tahun depan',
				requiresVote: true,
				voteResults: {
					approve: 0,
					reject: 0,
					abstain: 0,
					voters: []
				}
			},
			{
				id: 'agenda-3',
				title: 'Pemilihan Pengurus Baru',
				description: 'Voting untuk memilih pengurus periode 2025-2027',
				requiresVote: true,
				voteResults: {
					approve: 0,
					reject: 0,
					abstain: 0,
					voters: []
				}
			}
		],
		createdAt: new Date('2024-11-01T08:00:00'),
		updatedAt: new Date('2024-11-01T08:00:00')
	},
	{
		id: '2',
		title: 'Rapat Evaluasi Triwulan III',
		date: new Date('2024-10-20T14:00:00'),
		location: 'Ruang Rapat Koperasi',
		status: 'completed',
		attendees: ['1', '2', '3', '4', '5'],
		agendaItems: [
			{
				id: 'agenda-1',
				title: 'Review Kinerja Q3',
				description: 'Evaluasi pencapaian target triwulan III',
				requiresVote: false
			},
			{
				id: 'agenda-2',
				title: 'Persetujuan Program Pelatihan',
				description: 'Voting untuk program pelatihan anggota',
				requiresVote: true,
				voteResults: {
					approve: 4,
					reject: 0,
					abstain: 1,
					voters: ['1', '2', '3', '4', '5']
				}
			}
		],
		createdAt: new Date('2024-10-01T08:00:00'),
		updatedAt: new Date('2024-10-20T16:00:00')
	},
	{
		id: '3',
		title: 'Rapat Koordinasi Bulanan',
		date: new Date('2024-11-25T09:00:00'),
		location: 'Ruang Rapat Koperasi',
		status: 'ongoing',
		attendees: ['1', '2', '3'],
		agendaItems: [
			{
				id: 'agenda-1',
				title: 'Update Progress Proyek',
				description: 'Laporan kemajuan proyek bulan ini',
				requiresVote: false
			},
			{
				id: 'agenda-2',
				title: 'Persetujuan Kerjasama Baru',
				description: 'Voting untuk kerjasama dengan mitra baru',
				requiresVote: true,
				voteResults: {
					approve: 2,
					reject: 0,
					abstain: 1,
					voters: ['1', '2', '3']
				}
			}
		],
		createdAt: new Date('2024-11-15T08:00:00'),
		updatedAt: new Date('2024-11-25T09:00:00')
	}
];
