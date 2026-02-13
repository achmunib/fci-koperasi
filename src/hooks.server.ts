import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get token from cookie
	const token = event.cookies.get('auth_token');

	// Add token to locals for use in load functions
	event.locals.token = token || null;
	event.locals.isAuthenticated = !!token;

	return resolve(event);
};
