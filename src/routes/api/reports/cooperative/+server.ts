import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { CooperativeReport } from '$lib/types';

// Mock data - in a real app, this would query the database
export const GET: RequestHandler = async ({ url }) => {
	const startDate = url.searchParams.get('startDate');
	const endDate = url.searchParams.get('endDate');

	// Mock cooperative report data
	const report: CooperativeReport = {
		totalMembers: 25,
		activeMembers: 22,
		totalSales: 45000000,
		totalSavings: 35000000,
		totalLoansOutstanding: 15000000,
		totalSHUDistributed: 8000000,
		recentTransactions: [
			{
				id: '1',
				date: new Date('2024-11-20'),
				memberId: '1',
				memberName: 'Budi Santoso',
				productId: '1',
				productName: 'Beras Organik',
				quantity: 50,
				pricePerUnit: 15000,
				total: 750000,
				createdAt: new Date('2024-11-20')
			},
			{
				id: '2',
				date: new Date('2024-11-19'),
				memberId: '2',
				memberName: 'Siti Aminah',
				productId: '2',
				productName: 'Sayuran Segar',
				quantity: 100,
				pricePerUnit: 5000,
				total: 500000,
				createdAt: new Date('2024-11-19')
			},
			{
				id: '3',
				date: new Date('2024-11-18'),
				memberId: '3',
				memberName: 'Ahmad Yani',
				productId: '3',
				productName: 'Buah-buahan',
				quantity: 75,
				pricePerUnit: 8000,
				total: 600000,
				createdAt: new Date('2024-11-18')
			}
		],
		topProducers: [
			{
				member: {
					id: '1',
					name: 'Budi Santoso',
					idNumber: 'A001',
					address: 'Jl. Merdeka No. 123',
					phone: '081234567890',
					email: 'budi@example.com',
					joinDate: new Date('2023-01-15'),
					status: 'active',
					createdAt: new Date('2023-01-15'),
					updatedAt: new Date('2024-01-15')
				},
				totalSales: 12500000
			},
			{
				member: {
					id: '2',
					name: 'Siti Aminah',
					idNumber: 'A002',
					address: 'Jl. Sudirman No. 456',
					phone: '081234567891',
					email: 'siti@example.com',
					joinDate: new Date('2023-02-20'),
					status: 'active',
					createdAt: new Date('2023-02-20'),
					updatedAt: new Date('2024-02-20')
				},
				totalSales: 10200000
			},
			{
				member: {
					id: '3',
					name: 'Ahmad Yani',
					idNumber: 'A003',
					address: 'Jl. Gatot Subroto No. 789',
					phone: '081234567892',
					email: 'ahmad@example.com',
					joinDate: new Date('2023-03-10'),
					status: 'active',
					createdAt: new Date('2023-03-10'),
					updatedAt: new Date('2024-03-10')
				},
				totalSales: 8750000
			}
		]
	};

	return json({
		success: true,
		data: report
	});
};
