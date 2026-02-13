/**
 * Extract form data and convert to typed object
 * @param formData - FormData object from form submission
 * @returns Typed object with form values
 */
export function extractFormData<T>(formData: FormData): T {
	const data: any = {};

	for (const [key, value] of formData.entries()) {
		// Handle multiple values for same key (checkboxes, multi-select)
		if (key in data) {
			if (Array.isArray(data[key])) {
				data[key].push(value);
			} else {
				data[key] = [data[key], value];
			}
		} else {
			data[key] = value;
		}
	}

	return data as T;
}

/**
 * Handle form errors and extract user-friendly message
 * @param error - Error object from API or validation
 * @returns User-friendly error message
 */
export function handleFormError(error: any): string {
	// Handle API response errors
	if (error?.response?.data?.message) {
		return error.response.data.message;
	}

	// Handle API response errors (alternative structure)
	if (error?.data?.error) {
		return error.data.error;
	}

	// Handle validation errors
	if (error?.message) {
		return error.message;
	}

	// Handle string errors
	if (typeof error === 'string') {
		return error;
	}

	// Default error message
	return 'Terjadi kesalahan. Silakan coba lagi.';
}

/**
 * Convert form field errors to display format
 * @param errors - Object with field names as keys and error messages as values
 * @returns Formatted error object
 */
export function formatFieldErrors(errors: Record<string, string | string[]>): Record<string, string> {
	const formatted: Record<string, string> = {};

	for (const [field, error] of Object.entries(errors)) {
		if (Array.isArray(error)) {
			formatted[field] = error.join(', ');
		} else {
			formatted[field] = error;
		}
	}

	return formatted;
}

/**
 * Check if form has any errors
 * @param errors - Object with field names as keys and error messages as values
 * @returns true if any field has an error
 */
export function hasFormErrors(errors: Record<string, string | undefined>): boolean {
	return Object.values(errors).some((error) => error !== undefined && error !== '');
}

/**
 * Reset form errors
 * @param fields - Array of field names to reset
 * @returns Object with all fields set to undefined
 */
export function resetFormErrors(fields: string[]): Record<string, undefined> {
	const errors: Record<string, undefined> = {};
	fields.forEach((field) => {
		errors[field] = undefined;
	});
	return errors;
}
