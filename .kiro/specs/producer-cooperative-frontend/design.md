# Design Document: Producer Cooperative Frontend

## Overview

This document describes the design for a producer cooperative (koperasi produsen) management system frontend built with SvelteKit. The application provides a comprehensive web interface for managing cooperative operations including member management, product tracking, financial transactions, savings and loans, profit sharing, meetings, and reporting.

The frontend is built as a Single Page Application (SPA) using SvelteKit with server-side rendering (SSR) capabilities for improved performance and SEO. The application communicates with a backend API (not part of this spec) for data persistence and business logic.

## Architecture

### Technology Stack

- **Framework**: SvelteKit (latest stable version)
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Svelte stores for global state
- **Form Handling**: Svelte native form handling with validation
- **API Communication**: Fetch API with TypeScript interfaces
- **Date Handling**: date-fns for date manipulation and formatting
- **Currency Formatting**: Intl.NumberFormat for IDR formatting
- **Icons**: Lucide Svelte for consistent iconography

### Application Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Generic components (Button, Input, Modal)
│   │   ├── member/         # Member-specific components
│   │   ├── product/        # Product-specific components
│   │   ├── transaction/    # Transaction components
│   │   ├── savings/        # Savings components
│   │   ├── loan/           # Loan components
│   │   ├── shu/            # SHU/profit sharing components
│   │   ├── meeting/        # Meeting and voting components
│   │   └── report/         # Reporting components
│   ├── stores/             # Svelte stores for state management
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── constants/          # Application constants
├── routes/                 # SvelteKit routes (pages)
│   ├── +layout.svelte     # Root layout
│   ├── +page.svelte       # Dashboard
│   ├── login/             # Authentication
│   ├── members/           # Member management
│   ├── products/          # Product management
│   ├── transactions/      # Transaction tracking
│   ├── savings/           # Savings management
│   ├── loans/             # Loan management
│   ├── shu/               # SHU distribution
│   ├── meetings/          # Meeting management
│   └── reports/           # Financial reports
└── app.html               # HTML template
```

### Routing Strategy

SvelteKit's file-based routing is used with the following structure:

- `/` - Dashboard (overview of key metrics)
- `/login` - Authentication page
- `/members` - Member list
- `/members/[id]` - Member detail view
- `/members/new` - Create new member
- `/products` - Product list
- `/products/[id]` - Product detail view
- `/transactions` - Transaction list
- `/transactions/new` - Create transaction
- `/savings` - Savings overview
- `/savings/[memberId]` - Member savings detail
- `/loans` - Loan list
- `/loans/[id]` - Loan detail view
- `/shu` - SHU distribution management
- `/meetings` - Meeting list
- `/meetings/[id]` - Meeting detail with voting
- `/reports` - Report selection page
- `/reports/personal` - Personal financial report
- `/reports/cooperative` - Cooperative-wide report

## Components and Interfaces

### Core Components

#### 1. Layout Components

**AppLayout** (`+layout.svelte`)
- Provides consistent navigation and structure
- Includes sidebar navigation with role-based menu items
- Header with user info and logout
- Responsive design (collapsible sidebar on mobile)

**Sidebar**
- Navigation menu with icons
- Active route highlighting
- Role-based menu filtering

**Header**
- User profile display
- Notifications (optional)
- Logout button

#### 2. Common Components

**Button**
- Props: variant (primary, secondary, danger), size, disabled, loading
- Emits: click event
- Displays loading spinner when loading=true

**Input**
- Props: type, label, value, error, required, placeholder
- Emits: input, blur events
- Shows validation error messages

**Select**
- Props: label, options, value, error, required
- Emits: change event
- Supports searchable dropdown

**Modal**
- Props: open, title, size
- Slots: default (content), footer (actions)
- Emits: close event

**DataTable**
- Props: columns, data, sortable, paginated
- Features: sorting, pagination, row selection
- Emits: rowClick, sort, pageChange events

**Card**
- Props: title, subtitle
- Slots: default (content), actions
- Provides consistent card styling

**Alert**
- Props: type (success, error, warning, info), message
- Auto-dismissible with timeout option

#### 3. Member Components

**MemberList**
- Displays paginated member table
- Search and filter functionality
- Quick actions (view, edit, delete)

**MemberForm**
- Create/edit member form
- Fields: name, ID number, address, phone, email, join date, status
- Client-side validation

**MemberCard**
- Summary card showing member info
- Used in dashboard and detail views

#### 4. Product Components

**ProductList**
- Displays products with producer info
- Filter by category, producer, status
- Grid or list view toggle

**ProductForm**
- Create/edit product form
- Fields: name, description, category, price, unit, producer, status
- Image upload support (optional)

#### 5. Transaction Components

**TransactionList**
- Displays transaction history
- Filter by date range, member, product
- Shows running totals

**TransactionForm**
- Create transaction form
- Fields: date, member, product, quantity, price, total
- Auto-calculates total

**TransactionSummary**
- Displays aggregate transaction metrics
- Used in dashboard and reports

#### 6. Savings Components

**SavingsOverview**
- Shows total savings across all members
- Recent transactions list

**SavingsTransactionForm**
- Record deposit or withdrawal
- Fields: member, type, amount, date, notes
- Balance validation for withdrawals

**MemberSavingsDetail**
- Shows member's savings balance
- Transaction history
- Balance chart (optional)

#### 7. Loan Components

**LoanList**
- Displays all loans with status
- Filter by member, status, overdue

**LoanForm**
- Create loan form
- Fields: member, amount, interest rate, term, start date
- Generates repayment schedule

**LoanPaymentForm**
- Record loan payment
- Shows outstanding balance
- Updates payment schedule

**LoanDetail**
- Shows loan information
- Payment history
- Repayment schedule

#### 8. SHU Components

**SHUCalculator**
- Input form for SHU parameters
- Calculation preview
- Member-wise breakdown

**SHUDistributionList**
- Shows calculated SHU per member
- Approve and distribute actions

#### 9. Meeting Components

**MeetingList**
- Displays upcoming and past meetings
- Attendance tracking

**MeetingForm**
- Create/edit meeting
- Fields: title, date, location, agenda items
- Voting item configuration

**VotingInterface**
- Displays agenda items
- Vote buttons (approve, reject, abstain)
- Real-time vote counts (if supported)

**MeetingDetail**
- Shows meeting info
- Attendance list
- Voting results

#### 10. Report Components

**ReportSelector**
- Choose report type
- Date range picker
- Export format selection

**PersonalReport**
- Member's financial summary
- Transactions, savings, loans, SHU
- Downloadable PDF/CSV

**CooperativeReport**
- Aggregate financial data
- Charts and graphs
- Key performance indicators

## Data Models

### TypeScript Interfaces

```typescript
// Member
interface Member {
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
interface Product {
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
interface Transaction {
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
interface SavingsTransaction {
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
interface SavingsSummary {
  memberId: string;
  memberName: string;
  currentBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  lastTransactionDate: Date;
}

// Loan
interface Loan {
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
interface LoanPayment {
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
interface SHUDistribution {
  id: string;
  period: string; // e.g., "2024"
  totalProfit: number;
  distributionDate: Date;
  status: 'calculated' | 'distributed';
  createdAt: Date;
}

// SHU Member Share
interface SHUMemberShare {
  distributionId: string;
  memberId: string;
  memberName: string;
  transactionContribution: number;
  savingsContribution: number;
  totalShare: number;
  percentage: number;
}

// Meeting
interface Meeting {
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
interface AgendaItem {
  id: string;
  title: string;
  description: string;
  requiresVote: boolean;
  voteResults?: VoteResults;
}

// Vote Results
interface VoteResults {
  approve: number;
  reject: number;
  abstain: number;
  voters: string[]; // Member IDs who voted
}

// Vote
interface Vote {
  meetingId: string;
  agendaItemId: string;
  memberId: string;
  choice: 'approve' | 'reject' | 'abstain';
  timestamp: Date;
}

// User (Authentication)
interface User {
  id: string;
  username: string;
  role: 'admin' | 'member' | 'viewer';
  memberId?: string; // If user is a member
  name: string;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## State Management

### Svelte Stores

**authStore** (`lib/stores/auth.ts`)
- Manages authentication state
- Stores current user and token
- Provides login/logout functions

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

**memberStore** (`lib/stores/members.ts`)
- Caches member list
- Provides CRUD operations
- Handles search and filtering

**productStore** (`lib/stores/products.ts`)
- Caches product list
- Provides CRUD operations
- Handles filtering by category/producer

**notificationStore** (`lib/stores/notifications.ts`)
- Manages toast notifications
- Auto-dismissal with timeout
- Queue multiple notifications

```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
```

## Service Layer

### API Services

All API services follow a consistent pattern:

```typescript
// lib/services/api.ts
class ApiService {
  private baseUrl: string;
  private token: string | null;

  async get<T>(endpoint: string): Promise<ApiResponse<T>>;
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  async delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}
```

**memberService** (`lib/services/members.ts`)
- getMembers(filters?: MemberFilters): Promise<Member[]>
- getMember(id: string): Promise<Member>
- createMember(data: CreateMemberDto): Promise<Member>
- updateMember(id: string, data: UpdateMemberDto): Promise<Member>
- deleteMember(id: string): Promise<void>

**productService** (`lib/services/products.ts`)
- getProducts(filters?: ProductFilters): Promise<Product[]>
- getProduct(id: string): Promise<Product>
- createProduct(data: CreateProductDto): Promise<Product>
- updateProduct(id: string, data: UpdateProductDto): Promise<Product>
- deleteProduct(id: string): Promise<void>

**transactionService** (`lib/services/transactions.ts`)
- getTransactions(filters?: TransactionFilters): Promise<Transaction[]>
- getTransaction(id: string): Promise<Transaction>
- createTransaction(data: CreateTransactionDto): Promise<Transaction>
- getMemberTransactions(memberId: string): Promise<Transaction[]>

**savingsService** (`lib/services/savings.ts`)
- getSavingsSummary(): Promise<SavingsSummary[]>
- getMemberSavings(memberId: string): Promise<SavingsSummary>
- getSavingsTransactions(memberId: string): Promise<SavingsTransaction[]>
- createDeposit(data: CreateDepositDto): Promise<SavingsTransaction>
- createWithdrawal(data: CreateWithdrawalDto): Promise<SavingsTransaction>

**loanService** (`lib/services/loans.ts`)
- getLoans(filters?: LoanFilters): Promise<Loan[]>
- getLoan(id: string): Promise<Loan>
- createLoan(data: CreateLoanDto): Promise<Loan>
- getLoanPayments(loanId: string): Promise<LoanPayment[]>
- createPayment(loanId: string, data: CreatePaymentDto): Promise<LoanPayment>

**shuService** (`lib/services/shu.ts`)
- calculateSHU(params: SHUCalculationParams): Promise<SHUMemberShare[]>
- distributeSHU(distributionId: string): Promise<SHUDistribution>
- getSHUHistory(): Promise<SHUDistribution[]>

**meetingService** (`lib/services/meetings.ts`)
- getMeetings(filters?: MeetingFilters): Promise<Meeting[]>
- getMeeting(id: string): Promise<Meeting>
- createMeeting(data: CreateMeetingDto): Promise<Meeting>
- updateMeeting(id: string, data: UpdateMeetingDto): Promise<Meeting>
- recordAttendance(meetingId: string, memberIds: string[]): Promise<void>
- submitVote(vote: Vote): Promise<void>
- getVoteResults(meetingId: string, agendaItemId: string): Promise<VoteResults>

**reportService** (`lib/services/reports.ts`)
- getPersonalReport(memberId: string, dateRange: DateRange): Promise<PersonalReport>
- getCooperativeReport(dateRange: DateRange): Promise<CooperativeReport>
- exportReport(reportType: string, format: 'pdf' | 'csv', params: any): Promise<Blob>

## Utility Functions

### Currency Formatting (`lib/utils/currency.ts`)

```typescript
function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}
```

### Date Formatting (`lib/utils/date.ts`)

```typescript
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: id });
}
```

### Validation (`lib/utils/validation.ts`)

```typescript
function validateEmail(email: string): boolean;
function validatePhone(phone: string): boolean;
function validateRequired(value: any): boolean;
function validatePositiveNumber(value: number): boolean;
```

### Form Helpers (`lib/utils/forms.ts`)

```typescript
function handleFormError(error: any): string;
function extractFormData<T>(formData: FormData): T;
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Member Management Properties

**Property 1: Member form validation**
*For any* member data input, the validation function should reject inputs with missing required fields, invalid email formats, or invalid phone formats, and accept inputs with all valid fields.
**Validates: Requirements 1.1, 1.4**

**Property 2: Member rendering completeness**
*For any* member object, the rendered output should contain the member's name, ID number, status, and contact information.
**Validates: Requirements 1.2, 1.6**

**Property 3: Member search accuracy**
*For any* search query and member list, the filtered results should only include members whose name, ID number, or contact information contains the search query.
**Validates: Requirements 1.3**

**Property 4: Member deletion protection**
*For any* member with associated transactions, products, loans, or savings, deletion attempts should be rejected with an appropriate error message.
**Validates: Requirements 1.5**

### Product Management Properties

**Property 5: Product form validation**
*For any* product data input, the validation function should reject inputs with missing required fields, negative prices, or invalid units, and accept inputs with all valid fields.
**Validates: Requirements 2.1, 2.3**

**Property 6: Product rendering with producer**
*For any* product object, the rendered output should contain the product name, price, status, and the associated producer's name.
**Validates: Requirements 2.2, 2.5**

**Property 7: Product filtering accuracy**
*For any* filter criteria (name, category, producer, status) and product list, the filtered results should only include products matching all specified criteria.
**Validates: Requirements 2.4**

**Property 8: Product deletion protection**
*For any* product with associated transactions, deletion attempts should be rejected with an appropriate error message.
**Validates: Requirements 2.6**

### Transaction Management Properties

**Property 9: Transaction total calculation**
*For any* transaction with quantity and price per unit, the calculated total should equal quantity multiplied by price per unit.
**Validates: Requirements 3.1**

**Property 10: Transaction association integrity**
*For any* created transaction, the transaction object should maintain correct references to the associated member ID and product ID.
**Validates: Requirements 3.2**

**Property 11: Transaction sorting**
*For any* list of transactions, when sorted by date in descending order, each transaction's date should be greater than or equal to the next transaction's date.
**Validates: Requirements 3.3**

**Property 12: Transaction filtering**
*For any* date range, member ID, or product ID filter and transaction list, the filtered results should only include transactions matching all specified criteria.
**Validates: Requirements 3.4**

**Property 13: Running total calculation**
*For any* list of transactions, the running total should equal the sum of all transaction amounts.
**Validates: Requirements 3.5**

**Property 14: Member statistics update**
*For any* member and new transaction, after the transaction is recorded, the member's total sales should increase by the transaction amount.
**Validates: Requirements 3.6**

### Savings Management Properties

**Property 15: Savings deposit balance update**
*For any* member with current balance B and deposit amount D (where D > 0), after recording the deposit, the new balance should equal B + D.
**Validates: Requirements 4.1**

**Property 16: Savings withdrawal validation**
*For any* member with current balance B and withdrawal amount W, the withdrawal should be rejected if W > B, and accepted if W ≤ B.
**Validates: Requirements 4.2**

**Property 17: Savings balance non-negativity**
*For any* sequence of deposits and withdrawals, the member's savings balance should never be negative.
**Validates: Requirements 4.6**

**Property 18: Savings display completeness**
*For any* member's savings data, the rendered output should contain current balance and transaction history with dates, types, and amounts.
**Validates: Requirements 4.3**

**Property 19: Total savings aggregation**
*For any* list of member savings balances, the total savings should equal the sum of all individual member balances.
**Validates: Requirements 4.4**

**Property 20: Savings transaction filtering**
*For any* filter criteria (date range, transaction type) and savings transaction list, the filtered results should only include transactions matching all specified criteria.
**Validates: Requirements 4.5**

### Loan Management Properties

**Property 21: Loan repayment schedule calculation**
*For any* loan with amount A, interest rate R, and term T months, the generated repayment schedule should have T entries, and the sum of all principal payments should equal A.
**Validates: Requirements 5.1**

**Property 22: Loan payment balance update**
*For any* loan with outstanding balance B and payment amount P (where P ≤ B), after recording the payment, the new outstanding balance should equal B - P (adjusted for interest allocation).
**Validates: Requirements 5.2**

**Property 23: Loan status calculation**
*For any* loan with due date D and outstanding balance B, if current date > D and B > 0, the loan status should be "overdue".
**Validates: Requirements 5.5**

**Property 24: Loan approval validation**
*For any* member with existing overdue loans, new loan creation attempts should be rejected with an appropriate error message.
**Validates: Requirements 5.6**

**Property 25: Loan display completeness**
*For any* member's loan data, the rendered output should contain all active and completed loans with their payment status and outstanding balances.
**Validates: Requirements 5.3**

**Property 26: Total outstanding loans aggregation**
*For any* list of loans, the total outstanding amount should equal the sum of all individual loan outstanding balances.
**Validates: Requirements 5.4**

### SHU Distribution Properties

**Property 27: SHU calculation correctness**
*For any* set of members with transaction contributions T and savings contributions S, and distribution parameters (transaction weight Wt, savings weight Ws), each member's SHU share should be proportional to (T × Wt + S × Ws), and the sum of all shares should equal the total profit.
**Validates: Requirements 6.1**

**Property 28: SHU distribution recording**
*For any* SHU distribution, after distribution is completed, each member's account should reflect the SHU amount received, and the distribution status should be marked as "distributed".
**Validates: Requirements 6.3**

**Property 29: SHU period uniqueness**
*For any* period identifier, only one SHU distribution with status "distributed" should exist for that period.
**Validates: Requirements 6.6**

**Property 30: SHU breakdown display**
*For any* SHU distribution, the rendered breakdown should contain each member's transaction contribution, savings contribution, calculation weights, and final share amount.
**Validates: Requirements 6.2**

**Property 31: SHU report completeness**
*For any* SHU report, the output should contain total profit, distribution date, all member contributions, and calculated shares.
**Validates: Requirements 6.5**

**Property 32: SHU parameter configuration**
*For any* valid SHU calculation parameters (percentage splits, weights), the system should accept and store them, and subsequent calculations should use the updated parameters.
**Validates: Requirements 6.4**

### Meeting and Voting Properties

**Property 33: Meeting form validation**
*For any* meeting data input, the validation function should reject inputs with missing title, invalid dates (past dates for new meetings), or empty agenda items, and accept inputs with all valid fields.
**Validates: Requirements 7.1**

**Property 34: Vote uniqueness enforcement**
*For any* meeting, agenda item, and member, only one vote should be recorded, and subsequent vote attempts by the same member should update the existing vote, not create duplicates.
**Validates: Requirements 7.3**

**Property 35: Vote counting accuracy**
*For any* agenda item with votes, the displayed vote counts for approve, reject, and abstain should equal the actual number of votes cast for each choice.
**Validates: Requirements 7.4**

**Property 36: Meeting closure finalization**
*For any* meeting with status "completed", vote submission attempts should be rejected, and vote results should remain unchanged.
**Validates: Requirements 7.6**

**Property 37: Voting interface completeness**
*For any* meeting with voting items, members should be able to submit votes (approve, reject, abstain) for each agenda item.
**Validates: Requirements 7.2**

**Property 38: Attendance tracking**
*For any* meeting with recorded attendees, the attendance percentage should equal (number of attendees / total active members) × 100.
**Validates: Requirements 7.5**

### Financial Reporting Properties

**Property 39: Personal report completeness**
*For any* member and date range, the personal report should contain all transactions, savings transactions, loan payments, and SHU distributions within that date range.
**Validates: Requirements 8.1**

**Property 40: Cooperative report aggregation**
*For any* date range, the cooperative report's aggregate totals (total sales, total savings, total loans) should equal the sum of all individual member amounts within that date range.
**Validates: Requirements 8.2, 8.4**

**Property 41: Report date filtering**
*For any* date range filter and report data, all included records should have dates within the specified range (inclusive).
**Validates: Requirements 8.3**

**Property 42: Real-time financial display updates**
*For any* financial display (dashboard, totals, balances), after a new transaction is recorded, the displayed values should reflect the updated data.
**Validates: Requirements 8.6**

### Authentication and Authorization Properties

**Property 43: Credential validation**
*For any* login attempt, valid username-password combinations should result in successful authentication with a session token, and invalid combinations should be rejected with an error message.
**Validates: Requirements 9.1**

**Property 44: Role-based access control**
*For any* user with role R and feature F, access to F should be granted if R has permission for F, and denied otherwise with redirect to login or error page.
**Validates: Requirements 9.2, 9.3**

**Property 45: Session expiration handling**
*For any* expired session, API requests should be rejected with authentication error, and the user should be redirected to login.
**Validates: Requirements 9.4**

**Property 46: Logout cleanup**
*For any* logout action, the authentication token should be cleared from storage, and the auth state should be reset to unauthenticated.
**Validates: Requirements 9.5**

**Property 47: Role-based UI rendering**
*For any* user with role R, the UI should only display navigation items and action buttons that R has permission to access.
**Validates: Requirements 9.6**

### User Interface Properties

**Property 48: Loading state feedback**
*For any* asynchronous action (API call, form submission), the UI should display a loading indicator while the action is in progress, and remove it when complete.
**Validates: Requirements 10.3**

**Property 49: Error message display**
*For any* error that occurs during user actions, the system should display an error message containing information about what went wrong.
**Validates: Requirements 10.5**

**Property 50: Currency formatting consistency**
*For any* numeric amount representing currency, the displayed value should be formatted as Indonesian Rupiah (IDR) with proper thousand separators and no decimal places.
**Validates: Requirements 10.6**

## Error Handling

### Client-Side Error Handling

**Form Validation Errors**
- Display inline error messages below invalid fields
- Prevent form submission until all validation passes
- Highlight invalid fields with red borders
- Show summary of errors at top of form

**API Errors**
- Network errors: Display "Koneksi gagal. Silakan coba lagi." (Connection failed. Please try again.)
- 400 Bad Request: Display specific validation errors from API response
- 401 Unauthorized: Redirect to login page and clear session
- 403 Forbidden: Display "Anda tidak memiliki akses." (You don't have access.)
- 404 Not Found: Display "Data tidak ditemukan." (Data not found.)
- 500 Server Error: Display "Terjadi kesalahan server. Silakan coba lagi nanti." (Server error occurred. Please try again later.)

**State Management Errors**
- Store update failures: Log to console and display generic error to user
- Invalid state transitions: Prevent action and display appropriate message

### Error Recovery

**Retry Mechanisms**
- Failed API calls: Provide "Coba Lagi" (Try Again) button
- Network timeouts: Automatic retry with exponential backoff (max 3 attempts)

**Data Persistence**
- Form data: Save to localStorage on input to prevent data loss
- Restore form data on page reload if submission failed

**Graceful Degradation**
- If real-time updates fail, provide manual refresh button
- If export fails, offer alternative format or simplified export

## Testing Strategy

### Unit Testing

Unit tests focus on specific functions and components in isolation:

**Utility Functions**
- Currency formatting (formatIDR)
- Date formatting (formatDate)
- Validation functions (validateEmail, validatePhone, etc.)
- Form helpers (extractFormData, handleFormError)

**Component Logic**
- Form validation logic
- Calculation functions (totals, balances, SHU)
- Filtering and sorting logic
- State management (store actions and updates)

**Service Layer**
- API service methods (mocking fetch calls)
- Request/response transformation
- Error handling in services

### Property-Based Testing

Property-based tests verify universal properties across many generated inputs. Each test should run a minimum of 100 iterations with randomized inputs.

**Test Configuration**
- Use a property-based testing library for JavaScript/TypeScript (e.g., fast-check)
- Configure each test to run minimum 100 iterations
- Tag each test with a comment referencing the design property

**Tag Format**
```typescript
// Feature: producer-cooperative-frontend, Property 1: Member form validation
```

**Property Test Implementation**
Each correctness property listed above should be implemented as a property-based test:

- Properties 1-4: Member management tests
- Properties 5-8: Product management tests
- Properties 9-14: Transaction management tests
- Properties 15-20: Savings management tests
- Properties 21-26: Loan management tests
- Properties 27-32: SHU distribution tests
- Properties 33-38: Meeting and voting tests
- Properties 39-42: Financial reporting tests
- Properties 43-47: Authentication and authorization tests
- Properties 48-50: User interface tests

**Example Property Test Structure**
```typescript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

// Feature: producer-cooperative-frontend, Property 9: Transaction total calculation
describe('Transaction total calculation', () => {
  it('should calculate total as quantity × price for any valid inputs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }), // quantity
        fc.float({ min: 0.01, max: 1000000, noNaN: true }), // price
        (quantity, price) => {
          const transaction = { quantity, pricePerUnit: price };
          const total = calculateTransactionTotal(transaction);
          expect(total).toBeCloseTo(quantity * price, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

Integration tests verify that components work together correctly:

**Component Integration**
- Form submission flows (form → validation → API call → state update → UI update)
- Navigation flows (route changes, authentication checks)
- Store integration (component → store → component updates)

**API Integration**
- Service layer integration with mock API
- Error handling across service and component layers
- Authentication flow (login → token storage → authenticated requests)

### End-to-End Testing (Optional)

E2E tests verify complete user workflows:

**Critical User Flows**
- Login → View dashboard → Create transaction → View updated totals
- Admin creates member → Member logs in → Member adds product
- Record savings deposit → View updated balance → Record withdrawal
- Create meeting → Members vote → View results

**Testing Tools**
- Playwright or Cypress for E2E testing
- Mock backend API for consistent test data

### Testing Balance

- **Unit tests**: Focus on specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs (comprehensive coverage)
- Together they provide complete coverage: unit tests catch concrete bugs, property tests verify general correctness

Avoid writing too many unit tests for cases that property tests already cover. Property tests handle covering lots of inputs automatically.

## Implementation Notes

### SvelteKit-Specific Considerations

**Server-Side Rendering (SSR)**
- Use `+page.server.ts` for data loading that requires authentication
- Implement proper error handling in load functions
- Use `+page.ts` for client-side only data loading

**Form Actions**
- Use SvelteKit form actions for progressive enhancement
- Implement `+page.server.ts` actions for form submissions
- Provide client-side validation for better UX

**API Routes**
- If backend API is not available, implement API routes in `src/routes/api/`
- Use `+server.ts` files for API endpoints
- Implement proper CORS and authentication middleware

### Performance Considerations

**Code Splitting**
- Use dynamic imports for large components
- Lazy load routes that are not immediately needed
- Split vendor bundles for better caching

**Data Loading**
- Implement pagination for large lists (members, products, transactions)
- Use infinite scroll or "Load More" buttons
- Cache frequently accessed data in stores

**Optimistic Updates**
- Update UI immediately on user actions
- Revert changes if API call fails
- Show loading states for slower operations

### Accessibility

**Keyboard Navigation**
- Ensure all interactive elements are keyboard accessible
- Implement proper focus management
- Use semantic HTML elements

**Screen Reader Support**
- Add ARIA labels where needed
- Provide alternative text for icons
- Announce dynamic content changes

**Color Contrast**
- Ensure sufficient contrast for text and interactive elements
- Don't rely solely on color to convey information

### Internationalization (i18n)

**Language Support**
- All UI text in Bahasa Indonesia
- Use a translation file structure for easy updates
- Format dates and numbers according to Indonesian locale

**Currency and Number Formatting**
- Use Intl.NumberFormat for consistent formatting
- Display all currency in IDR
- Use Indonesian thousand separators (.)

### Security Considerations

**Authentication**
- Store tokens securely (httpOnly cookies preferred over localStorage)
- Implement token refresh mechanism
- Clear sensitive data on logout

**Authorization**
- Verify permissions on both client and server
- Don't expose sensitive data in client-side code
- Implement proper role-based access control

**Input Validation**
- Validate all user inputs on client and server
- Sanitize inputs to prevent XSS
- Use parameterized queries to prevent injection attacks (backend)

**HTTPS**
- Enforce HTTPS in production
- Use secure cookies
- Implement Content Security Policy (CSP)
