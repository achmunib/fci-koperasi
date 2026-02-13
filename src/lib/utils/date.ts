import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format a date using Indonesian locale
 * @param date - Date object or ISO string
 * @param formatStr - Format string (default: 'dd MMMM yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy'): string {
	const dateObj = typeof date === 'string' ? parseISO(date) : date;
	return format(dateObj, formatStr, { locale: id });
}

/**
 * Format a date as short date (e.g., "01/12/2024")
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatShortDate(date: Date | string): string {
	return formatDate(date, 'dd/MM/yyyy');
}

/**
 * Format a date with time (e.g., "01 Desember 2024, 14:30")
 * @param date - Date object or ISO string
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
	return formatDate(date, 'dd MMMM yyyy, HH:mm');
}
