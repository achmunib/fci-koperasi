/**
 * Validate email format
 * @param email - Email string to validate
 * @returns true if valid email format
 */
export function validateEmail(email: string): boolean {
	if (!email || typeof email !== 'string') return false;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email.trim());
}

/**
 * Validate Indonesian phone number format
 * Accepts formats: 08xx, +628xx, 628xx
 * @param phone - Phone number string to validate
 * @returns true if valid phone format
 */
export function validatePhone(phone: string): boolean {
	if (!phone || typeof phone !== 'string') return false;
	const cleaned = phone.replace(/[\s-]/g, '');
	// Must start with 08, +628, or 628, followed by 9-12 more digits
	const phoneRegex = /^(\+628|628|08)[0-9]{9,12}$/;
	return phoneRegex.test(cleaned);
}

/**
 * Validate that a value is not empty
 * @param value - Value to validate
 * @returns true if value is not null, undefined, or empty string
 */
export function validateRequired(value: any): boolean {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string') return value.trim().length > 0;
	if (typeof value === 'number') return !isNaN(value);
	return true;
}

/**
 * Validate that a number is positive
 * @param value - Number to validate
 * @returns true if value is a positive number
 */
export function validatePositiveNumber(value: number): boolean {
	return typeof value === 'number' && !isNaN(value) && value > 0;
}

/**
 * Validate that a number is non-negative (zero or positive)
 * @param value - Number to validate
 * @returns true if value is zero or positive
 */
export function validateNonNegativeNumber(value: number): boolean {
	return typeof value === 'number' && !isNaN(value) && value >= 0;
}

/**
 * Validate Indonesian ID number (KTP)
 * Basic validation: 16 digits
 * @param idNumber - ID number string to validate
 * @returns true if valid format
 */
export function validateIdNumber(idNumber: string): boolean {
	if (!idNumber || typeof idNumber !== 'string') return false;
	const cleaned = idNumber.replace(/[\s-]/g, '');
	return /^\d{16}$/.test(cleaned);
}
