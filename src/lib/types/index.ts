// Member
export interface Member {
	id: string;
	name: string;
	idNumber: string;
	address: string;
	phone: string;
	email: string;
	joinDate: Date;
	status: 'active' | 'inactive' | 'suspended';
	createdAt: Date;
	updatedAt: Date;
}

// Product
export interface Product {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	unit: string;
	producerId: string; // Member ID
	producerName: string;
	status: 'available' | 'out_of_stock' | 'discontinued';
	createdAt: Date;
	updatedAt: Date;
}

// Transaction
export interface Transaction {
	id: string;
	date: Date;
	memberId: string;
	memberName: string;
	productId: string;
	productName: string;
	quantity: number;
	pricePerUnit: number;
	total: number;
	notes?: string;
	createdAt: Date;
}

// Savings Transaction
export interface SavingsTransaction {
	id: string;
	memberId: string;
	memberName: string;
	type: 'deposit' | 'withdrawal';
	amount: number;
	date: Date;
	balance: number; // Balance after transaction
	notes?: string;
	createdAt: Date;
}

// Savings Summary
export interface SavingsSummary {
	memberId: string;
	memberName: string;
	currentBalance: number;
	totalDeposits: number;
	totalWithdrawals: number;
	lastTransactionDate: Date;
}

// Loan
export interface Loan {
	id: string;
	memberId: string;
	memberName: string;
	amount: number;
	interestRate: number; // Percentage
	termMonths: number;
	startDate: Date;
	status: 'active' | 'completed' | 'overdue';
	outstandingBalance: number;
	createdAt: Date;
	updatedAt: Date;
}

// Loan Payment
export interface LoanPayment {
	id: string;
	loanId: string;
	amount: number;
	date: Date;
	principalPaid: number;
	interestPaid: number;
	remainingBalance: number;
	notes?: string;
	createdAt: Date;
}

// SHU Distribution
export interface SHUDistribution {
	id: string;
	period: string; // e.g., "2024"
	totalProfit: number;
	distributionDate: Date;
	status: 'calculated' | 'distributed';
	createdAt: Date;
}

// SHU Member Share
export interface SHUMemberShare {
	distributionId: string;
	memberId: string;
	memberName: string;
	transactionContribution: number;
	savingsContribution: number;
	totalShare: number;
	percentage: number;
}

// Meeting
export interface Meeting {
	id: string;
	title: string;
	date: Date;
	location: string;
	status: 'scheduled' | 'ongoing' | 'completed';
	attendees: string[]; // Member IDs
	agendaItems: AgendaItem[];
	createdAt: Date;
	updatedAt: Date;
}

// Agenda Item
export interface AgendaItem {
	id: string;
	title: string;
	description: string;
	requiresVote: boolean;
	voteResults?: VoteResults;
}

// Vote Results
export interface VoteResults {
	approve: number;
	reject: number;
	abstain: number;
	voters: string[]; // Member IDs who voted
}

// Vote
export interface Vote {
	meetingId: string;
	agendaItemId: string;
	memberId: string;
	choice: 'approve' | 'reject' | 'abstain';
	timestamp: Date;
}

// User (Authentication)
export interface User {
	id: string;
	username: string;
	role: 'admin' | 'member' | 'viewer';
	memberId?: string; // If user is a member
	name: string;
}

// API Response wrapper
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Auth State
export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

// Notification
export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number;
}

// Filter types
export interface MemberFilters {
	search?: string;
	status?: Member['status'];
}

export interface ProductFilters {
	search?: string;
	category?: string;
	producerId?: string;
	status?: Product['status'];
}

export interface TransactionFilters {
	startDate?: Date;
	endDate?: Date;
	memberId?: string;
	productId?: string;
}

export interface LoanFilters {
	memberId?: string;
	status?: Loan['status'];
	overdue?: boolean;
}

export interface MeetingFilters {
	status?: Meeting['status'];
	startDate?: Date;
	endDate?: Date;
}

// DTO types
export interface CreateMemberDto {
	name: string;
	idNumber: string;
	address: string;
	phone: string;
	email: string;
	joinDate: Date;
	status: Member['status'];
}

export interface UpdateMemberDto extends Partial<CreateMemberDto> {}

export interface CreateProductDto {
	name: string;
	description: string;
	category: string;
	price: number;
	unit: string;
	producerId: string;
	status: Product['status'];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateTransactionDto {
	date: Date;
	memberId: string;
	productId: string;
	quantity: number;
	pricePerUnit: number;
	notes?: string;
}

export interface CreateDepositDto {
	memberId: string;
	amount: number;
	date: Date;
	notes?: string;
}

export interface CreateWithdrawalDto extends CreateDepositDto {}

export interface CreateLoanDto {
	memberId: string;
	amount: number;
	interestRate: number;
	termMonths: number;
	startDate: Date;
}

export interface CreatePaymentDto {
	amount: number;
	date: Date;
	notes?: string;
}

export interface CreateMeetingDto {
	title: string;
	date: Date;
	location: string;
	agendaItems: Omit<AgendaItem, 'id' | 'voteResults'>[];
}

export interface UpdateMeetingDto extends Partial<CreateMeetingDto> {}

export interface SHUCalculationParams {
	period: string;
	totalProfit: number;
	transactionWeight: number;
	savingsWeight: number;
}

export interface DateRange {
	startDate: Date;
	endDate: Date;
}

export interface PersonalReport {
	member: Member;
	transactions: Transaction[];
	savingsTransactions: SavingsTransaction[];
	loans: Loan[];
	shuDistributions: SHUMemberShare[];
	totalSales: number;
	currentSavingsBalance: number;
	totalLoansOutstanding: number;
	totalSHUReceived: number;
}

export interface CooperativeReport {
	totalMembers: number;
	activeMembers: number;
	totalSales: number;
	totalSavings: number;
	totalLoansOutstanding: number;
	totalSHUDistributed: number;
	recentTransactions: Transaction[];
	topProducers: Array<{ member: Member; totalSales: number }>;
}
