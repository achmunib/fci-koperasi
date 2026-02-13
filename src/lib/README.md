# Project Structure

This directory contains the core application code organized into the following subdirectories:

## Directory Structure

- **components/** - Reusable UI components
  - `common/` ✅ - Generic components (Button, Input, Select, Modal, Alert, Card, ProtectedAction)
  - `layout/` ✅ - Layout components (AppLayout, Sidebar, Header)
  - `member/` ✅ - Member-specific components (MemberList, MemberForm, MemberCard)
  - `product/` ✅ - Product-specific components (ProductList, ProductForm)
  - `transaction/` ✅ - Transaction components (TransactionList, TransactionForm, TransactionSummary)
  - `savings/` ✅ - Savings components (SavingsOverview, SavingsTransactionForm, MemberSavingsDetail)
  - `loan/` ✅ - Loan components (LoanList, LoanForm, LoanPaymentForm, LoanDetail)
  - `shu/` ✅ - SHU/profit sharing components (SHUCalculator, SHUDistributionList)
  - `meeting/` ✅ - Meeting and voting components (MeetingList, MeetingForm, VotingInterface, MeetingDetail)
  - `report/` ✅ - Reporting components (ReportSelector, PersonalReport, CooperativeReport)

- **stores/** - Svelte stores for global state management
  - ✅ `auth.ts` - Authentication state with login/logout
  - ✅ `members.ts` - Member data cache with search/filter
  - ✅ `products.ts` - Product data cache with multi-filter support
  - ✅ `transactions.ts` - Transaction data with date range filtering
  - ✅ `notifications.ts` - Toast notification queue with auto-dismissal

- **services/** - API service layer
  - ✅ `api.ts` - Base API service with HTTP methods and error handling
  - ✅ `auth.ts` - Authentication service
  - ✅ `members.ts` - Member CRUD operations
  - ✅ `products.ts` - Product CRUD operations
  - ✅ `transactions.ts` - Transaction operations
  - ✅ `savings.ts` - Savings deposit/withdrawal operations
  - ✅ `loans.ts` - Loan and payment operations
  - ✅ `shu.ts` - SHU calculation service
  - ✅ `meetings.ts` - Meeting and voting service
  - ✅ `reports.ts` - Report generation service

- **types/** - TypeScript type definitions and interfaces
  - ✅ Core data models (Member, Product, Transaction, Savings, Loan, SHU, Meeting, User)
  - ✅ API response types
  - ✅ Filter and DTO types

- **utils/** - Utility functions
  - ✅ `currency.ts` - Currency formatting (IDR) with tests
  - ✅ `date.ts` - Date formatting (Indonesian locale)
  - ✅ `validation.ts` - Validation functions with tests
  - ✅ `forms.ts` - Form helpers with tests
  - ✅ `permissions.ts` - Role-based access control with tests

- **constants/** - Application constants
  - Empty (constants defined inline as needed)

## Technology Stack

- **Framework**: SvelteKit 2.x with Svelte 5 syntax
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x (stable)
- **Testing**: Vitest + fast-check (property-based testing)
- **Date Handling**: date-fns with Indonesian locale
- **Icons**: lucide-svelte

## Implementation Status

### ✅ Completed Features (8/8 major features)
1. **Members** - Full CRUD with search/filter, detail pages
2. **Products** - Full CRUD with grid/list view, multi-filter support
3. **Transactions** - Create transactions with auto-calculation, date range filtering, running totals
4. **Savings** - Deposit/withdrawal with balance validation, transaction history
5. **Loans** - Loan creation with repayment calculation, payment tracking, progress visualization
6. **SHU Distribution** - Calculation with configurable weights, distribution preview, history
7. **Meetings & Voting** - Meeting management, voting interface, attendance tracking, vote results
8. **Financial Reports** - Personal and cooperative reports with date filtering, export to PDF/CSV

### 📊 Test Coverage
- **62 tests passing** across utilities, stores, and types
- Zero TypeScript errors
- Property-based testing framework configured

### 🎨 UI Components
- 11 common components (Button, Input, Select, Modal, Alert, Card, ProtectedAction, Toast, DataTable, Loading, ErrorBoundary)
- 3 layout components (AppLayout, Sidebar, Header)
- 20 feature-specific components across 8 features
- All components use Svelte 5 syntax ($state, $derived, $effect, $props)
- Fully responsive with Tailwind CSS
- Indonesian language throughout
- Accessibility compliant (ARIA labels, keyboard navigation, semantic HTML)

## Development

Run tests:
```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
```

Type checking:
```bash
npm run check         # Check types
npm run check:watch   # Check types in watch mode
```

Development server:
```bash
npm run dev           # Start dev server
```
