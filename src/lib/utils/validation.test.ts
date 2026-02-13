import { describe, it, expect } from 'vitest';
import {
	validateEmail,
	validatePhone,
	validateRequired,
	validatePositiveNumber,
	validateNonNegativeNumber,
	validateIdNumber
} from './validation';

describe('Validation utilities', () => {
	describe('validateEmail', () => {
		it('should accept valid email addresses', () => {
			expect(validateEmail('test@example.com')).toBe(true);
			expect(validateEmail('user.name@domain.co.id')).toBe(true);
			expect(validateEmail('admin+tag@company.com')).toBe(true);
		});

		it('should reject invalid email addresses', () => {
			expect(validateEmail('invalid')).toBe(false);
			expect(validateEmail('invalid@')).toBe(false);
			expect(validateEmail('@domain.com')).toBe(false);
			expect(validateEmail('test@domain')).toBe(false);
			expect(validateEmail('')).toBe(false);
		});

		it('should handle edge cases', () => {
			expect(validateEmail('  test@example.com  ')).toBe(true); // Trimmed
			expect(validateEmail(null as any)).toBe(false);
			expect(validateEmail(undefined as any)).toBe(false);
		});
	});

	describe('validatePhone', () => {
		it('should accept valid Indonesian phone numbers', () => {
			expect(validatePhone('081234567890')).toBe(true);
			expect(validatePhone('08123456789')).toBe(true);
			expect(validatePhone('+6281234567890')).toBe(true);
			expect(validatePhone('6281234567890')).toBe(true);
		});

		it('should accept phone numbers with spaces or dashes', () => {
			expect(validatePhone('0812-3456-7890')).toBe(true);
			expect(validatePhone('0812 3456 7890')).toBe(true);
		});

		it('should reject invalid phone numbers', () => {
			expect(validatePhone('123')).toBe(false);
			expect(validatePhone('08123')).toBe(false); // Too short
			expect(validatePhone('091234567890')).toBe(false); // Wrong prefix
			expect(validatePhone('')).toBe(false);
		});

		it('should handle edge cases', () => {
			expect(validatePhone(null as any)).toBe(false);
			expect(validatePhone(undefined as any)).toBe(false);
		});
	});

	describe('validateRequired', () => {
		it('should accept non-empty values', () => {
			expect(validateRequired('text')).toBe(true);
			expect(validateRequired(123)).toBe(true);
			expect(validateRequired(0)).toBe(true);
			expect(validateRequired(false)).toBe(true);
			expect(validateRequired([])).toBe(true);
			expect(validateRequired({})).toBe(true);
		});

		it('should reject empty values', () => {
			expect(validateRequired('')).toBe(false);
			expect(validateRequired('   ')).toBe(false);
			expect(validateRequired(null)).toBe(false);
			expect(validateRequired(undefined)).toBe(false);
		});

		it('should reject NaN', () => {
			expect(validateRequired(NaN)).toBe(false);
		});
	});

	describe('validatePositiveNumber', () => {
		it('should accept positive numbers', () => {
			expect(validatePositiveNumber(1)).toBe(true);
			expect(validatePositiveNumber(0.1)).toBe(true);
			expect(validatePositiveNumber(1000)).toBe(true);
		});

		it('should reject zero and negative numbers', () => {
			expect(validatePositiveNumber(0)).toBe(false);
			expect(validatePositiveNumber(-1)).toBe(false);
			expect(validatePositiveNumber(-0.1)).toBe(false);
		});

		it('should reject non-numbers', () => {
			expect(validatePositiveNumber(NaN)).toBe(false);
			expect(validatePositiveNumber('123' as any)).toBe(false);
		});
	});

	describe('validateNonNegativeNumber', () => {
		it('should accept zero and positive numbers', () => {
			expect(validateNonNegativeNumber(0)).toBe(true);
			expect(validateNonNegativeNumber(1)).toBe(true);
			expect(validateNonNegativeNumber(1000)).toBe(true);
		});

		it('should reject negative numbers', () => {
			expect(validateNonNegativeNumber(-1)).toBe(false);
			expect(validateNonNegativeNumber(-0.1)).toBe(false);
		});

		it('should reject non-numbers', () => {
			expect(validateNonNegativeNumber(NaN)).toBe(false);
		});
	});

	describe('validateIdNumber', () => {
		it('should accept valid 16-digit ID numbers', () => {
			expect(validateIdNumber('1234567890123456')).toBe(true);
			expect(validateIdNumber('3201234567890123')).toBe(true);
		});

		it('should accept ID numbers with spaces or dashes', () => {
			expect(validateIdNumber('1234 5678 9012 3456')).toBe(true);
			expect(validateIdNumber('1234-5678-9012-3456')).toBe(true);
		});

		it('should reject invalid ID numbers', () => {
			expect(validateIdNumber('123')).toBe(false); // Too short
			expect(validateIdNumber('12345678901234567')).toBe(false); // Too long
			expect(validateIdNumber('123456789012345a')).toBe(false); // Contains letter
			expect(validateIdNumber('')).toBe(false);
		});

		it('should handle edge cases', () => {
			expect(validateIdNumber(null as any)).toBe(false);
			expect(validateIdNumber(undefined as any)).toBe(false);
		});
	});
});
