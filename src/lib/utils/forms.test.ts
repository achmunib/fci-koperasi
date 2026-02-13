import { describe, it, expect } from 'vitest';
import {
	extractFormData,
	handleFormError,
	formatFieldErrors,
	hasFormErrors,
	resetFormErrors
} from './forms';

describe('Form utilities', () => {
	describe('extractFormData', () => {
		it('should extract simple form data', () => {
			const formData = new FormData();
			formData.append('name', 'John Doe');
			formData.append('email', 'john@example.com');

			const result = extractFormData<{ name: string; email: string }>(formData);

			expect(result.name).toBe('John Doe');
			expect(result.email).toBe('john@example.com');
		});

		it('should handle multiple values for same key', () => {
			const formData = new FormData();
			formData.append('tags', 'tag1');
			formData.append('tags', 'tag2');
			formData.append('tags', 'tag3');

			const result = extractFormData<{ tags: string[] }>(formData);

			expect(Array.isArray(result.tags)).toBe(true);
			expect(result.tags).toEqual(['tag1', 'tag2', 'tag3']);
		});

		it('should handle empty form data', () => {
			const formData = new FormData();
			const result = extractFormData<{}>(formData);

			expect(result).toEqual({});
		});
	});

	describe('handleFormError', () => {
		it('should extract message from API response', () => {
			const error = {
				response: {
					data: {
						message: 'Invalid input'
					}
				}
			};

			expect(handleFormError(error)).toBe('Invalid input');
		});

		it('should extract error from alternative structure', () => {
			const error = {
				data: {
					error: 'Validation failed'
				}
			};

			expect(handleFormError(error)).toBe('Validation failed');
		});

		it('should extract message from error object', () => {
			const error = new Error('Something went wrong');
			expect(handleFormError(error)).toBe('Something went wrong');
		});

		it('should handle string errors', () => {
			expect(handleFormError('Custom error')).toBe('Custom error');
		});

		it('should return default message for unknown errors', () => {
			expect(handleFormError({})).toBe('Terjadi kesalahan. Silakan coba lagi.');
			expect(handleFormError(null)).toBe('Terjadi kesalahan. Silakan coba lagi.');
		});
	});

	describe('formatFieldErrors', () => {
		it('should format string errors', () => {
			const errors = {
				name: 'Name is required',
				email: 'Invalid email'
			};

			const result = formatFieldErrors(errors);

			expect(result).toEqual({
				name: 'Name is required',
				email: 'Invalid email'
			});
		});

		it('should format array errors', () => {
			const errors = {
				name: ['Name is required', 'Name must be at least 3 characters'],
				email: ['Invalid email']
			};

			const result = formatFieldErrors(errors);

			expect(result.name).toBe('Name is required, Name must be at least 3 characters');
			expect(result.email).toBe('Invalid email');
		});

		it('should handle empty errors object', () => {
			const result = formatFieldErrors({});
			expect(result).toEqual({});
		});
	});

	describe('hasFormErrors', () => {
		it('should return true if any field has error', () => {
			const errors = {
				name: 'Name is required',
				email: undefined
			};

			expect(hasFormErrors(errors)).toBe(true);
		});

		it('should return false if no errors', () => {
			const errors = {
				name: undefined,
				email: undefined
			};

			expect(hasFormErrors(errors)).toBe(false);
		});

		it('should return false for empty string errors', () => {
			const errors = {
				name: '',
				email: ''
			};

			expect(hasFormErrors(errors)).toBe(false);
		});

		it('should handle empty errors object', () => {
			expect(hasFormErrors({})).toBe(false);
		});
	});

	describe('resetFormErrors', () => {
		it('should reset all fields to undefined', () => {
			const fields = ['name', 'email', 'phone'];
			const result = resetFormErrors(fields);

			expect(result).toEqual({
				name: undefined,
				email: undefined,
				phone: undefined
			});
		});

		it('should handle empty fields array', () => {
			const result = resetFormErrors([]);
			expect(result).toEqual({});
		});
	});
});
