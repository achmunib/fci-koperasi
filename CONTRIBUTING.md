# Contributing to Koperasi Produsen

Thank you for your interest in contributing to the Koperasi Produsen project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Prioritize the project's goals and user needs

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fci-koperasi.git
   cd fci-koperasi
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/fci-koperasi.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

### Spec-Driven Development

This project follows a structured development methodology:

1. **Requirements** (`.kiro/specs/*/requirements.md`)
   - Define user stories and acceptance criteria
   - Specify functional and non-functional requirements

2. **Design** (`.kiro/specs/*/design.md`)
   - Detail technical architecture
   - Define data models and API contracts
   - Specify correctness properties for testing

3. **Tasks** (`.kiro/specs/*/tasks.md`)
   - Break down work into actionable tasks
   - Track implementation progress

4. **Implementation**
   - Follow the design specifications
   - Write tests alongside code
   - Update documentation

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions or updates

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Use type aliases for unions and complex types

```typescript
// Good
interface User {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
}

// Avoid
const user: any = { ... };
```

### Svelte Components

- One component per file
- Use TypeScript in `<script lang="ts">`
- Keep components small and focused
- Use props for data input
- Emit events for actions
- Add JSDoc comments for props

```svelte
<script lang="ts">
  /**
   * The user's display name
   */
  export let name: string;
  
  /**
   * Whether the user is active
   */
  export let isActive: boolean = false;
</script>
```

### File Naming

- Components: `PascalCase.svelte` (e.g., `Button.svelte`)
- Utilities: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Types: `camelCase.ts` or `index.ts` (e.g., `types/index.ts`)
- Tests: `*.test.ts` (e.g., `validation.test.ts`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use semicolons
- Max line length: 100 characters
- Use meaningful variable names

```typescript
// Good
const userPermissions = ['read', 'write'];
const isAdmin = user.role === 'admin';

// Avoid
const up = ['read', 'write'];
const x = user.role === 'admin';
```

## 📝 Commit Guidelines

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Includes new API endpoints and UI components.

Closes #123
```

```bash
fix(validation): correct email validation regex

The previous regex didn't handle plus signs in email addresses.

Fixes #456
```

### Scope

Use the feature or module name:
- `auth` - Authentication
- `members` - Member management
- `products` - Product management
- `transactions` - Transaction tracking
- `savings` - Savings management
- `loans` - Loan management
- `shu` - SHU distribution
- `meetings` - Meeting management
- `reports` - Financial reporting
- `ui` - UI components
- `api` - API services
- `utils` - Utility functions

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   npm test
   npm run check
   ```

3. **Update documentation** if needed

4. **Test manually** in the browser

### Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub

3. **Fill out the PR template**
   - Describe your changes
   - Link related issues
   - Add screenshots for UI changes
   - List breaking changes if any

4. **Request review** from maintainers

### PR Title Format

Use the same format as commit messages:
```
feat(auth): add password reset functionality
```

### Review Process

- Maintainers will review your PR
- Address feedback and push updates
- Once approved, a maintainer will merge

### After Merge

- Delete your feature branch
- Update your local main branch
- Celebrate! 🎉

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for all new features
- Update tests when modifying existing code
- Aim for high test coverage
- Test edge cases and error conditions

### Test Types

**Unit Tests**
```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats Indonesian Rupiah correctly', () => {
    expect(formatCurrency(1000000)).toBe('Rp 1.000.000');
  });
});
```

**Property-Based Tests**
```typescript
import { fc, test } from '@fast-check/vitest';

test.prop([fc.integer()])('always returns positive', (n) => {
  expect(Math.abs(n)).toBeGreaterThanOrEqual(0);
});
```

**Component Tests**
```typescript
import { render, screen } from '@testing-library/svelte';
import Button from './Button.svelte';

it('renders button with text', () => {
  render(Button, { props: { text: 'Click me' } });
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- validation.test.ts
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex logic with inline comments
- Keep comments up-to-date with code changes

```typescript
/**
 * Formats a number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "Rp 1.000.000")
 */
export function formatCurrency(
  amount: number,
  options?: FormatOptions
): string {
  // Implementation
}
```

### README Updates

- Update README.md for new features
- Add examples for new functionality
- Keep the feature list current

### Spec Documentation

- Update requirements for new features
- Document design decisions
- Keep task lists synchronized

## ❓ Questions?

If you have questions:
- Check existing documentation
- Search closed issues
- Open a new issue with the `question` label
- Reach out to maintainers

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!
