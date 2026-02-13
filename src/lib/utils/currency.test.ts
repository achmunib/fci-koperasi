import { describe, it, expect } from 'vitest';
import { formatIDR } from './currency';

describe('Currency utilities', () => {
	describe('formatIDR', () => {
		it('should format positive numbers correctly', () => {
			const result1 = formatIDR(1000);
			const result2 = formatIDR(1000000);
			const result3 = formatIDR(50000);
			
			expect(result1).toContain('1.000');
			expect(result1).toContain('Rp');
			expect(result2).toContain('1.000.000');
			expect(result3).toContain('50.000');
		});

		it('should format zero correctly', () => {
			const result = formatIDR(0);
			expect(result).toContain('0');
			expect(result).toContain('Rp');
		});

		it('should format negative numbers correctly', () => {
			const result = formatIDR(-1000);
			expect(result).toContain('1.000');
			expect(result).toMatch(/^-/);
		});

		it('should round decimal values', () => {
			const result1 = formatIDR(1000.5);
			const result2 = formatIDR(1000.4);
			
			expect(result1).toContain('1.001');
			expect(result2).toContain('1.000');
		});

		it('should handle large numbers', () => {
			const result = formatIDR(1000000000);
			expect(result).toContain('1.000.000.000');
		});
	});
});
