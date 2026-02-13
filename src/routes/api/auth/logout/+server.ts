import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	// In a real app, you would invalidate the token in the database
	// For now, just return success
	return json({
		success: true,
		message: 'Logout berhasil'
	});
};
