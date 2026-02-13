import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { PersonalReport } from '$lib/types';

// Mock data - in a real app, this would query the database
export const GET: RequestHandler = async ({ params, url }) => {
	const memberId = params.memberId;
	const startDate = url.searchParams.get('startDate');
	const endDate = url.searchParams.get('endDate');

	// Mock personal report data
	const report: PersonalReport = {
		member: {
			id: memberId,
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
		transactions: [
			{
				id: '1',
				date: new Date('2024-11-20'),
				memberId,
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
				date: new Date('2024-11-15'),
				memberId,
				memberName: 'Budi Santoso',
				productId: '2',
				productName: 'Sayuran Segar',
				quantity: 30,
				pricePerUnit: 5000,
				total: 150000,
				createdAt: new Date('2024-11-15')
			}
		],
		savingsTransactions: [
			{
				id: '1',
				memberId,
				memberName: 'Budi Santoso',
				type: 'deposit',
				amount: 500000,
				date: new Date('2024-11-01'),
				balance: 2500000,
				createdAt: new Date('2024-11-01')
			},
			{
				id: '2',
				memberId,
				memberName: 'Budi Santoso',
				type: 'withdrawal',
				amount: 200000,
				date: new Date('2024-11-10'),
				balance: 2300000,
				createdAt: new Date('2024-11-10')
			}
		],
		loans: [
			{
				id: '1',
				memberId,
				memberName: 'Budi Santoso',
				amount: 5000000,
				interestRate: 12,
				termMonths: 12,
				startDate: new Date('2024-06-01'),
				status: 'active',
				outstandingBalance: 3000000,
				createdAt: new Date('2024-06-01'),
				updatedAt: new Date('2024-11-01')
			}
		],
		shuDistributions: [
			{
				distributionId: '2023',
				memberId,
				memberName: 'Budi Santoso',
				transactionContribution: 1500000,
				savingsContribution: 500000,
				totalShare: 2000000,
				percentage: 5.5
			}
		],
		totalSales: 900000,
		currentSavingsBalance: 2300000,
		totalLoansOutstanding: 3000000,
		totalSHUReceived: 2000000
	};

	return json({
		success: true,
		data: report
	});
};
