import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('auth_token');
	
	// If no token, redirect to login before rendering
	if (!token) {
		throw redirect(302, '/login');
	}
	
	return {};
};
