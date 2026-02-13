import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { User } from '$lib/types';

// Mock user database
const users = [
	{
		id: '1',
		username: 'admin',
		password: 'admin123', // In real app, this would be hashed
		name: 'Administrator',
		role: 'admin' as const
	},
	{
		id: '2',
		username: 'member',
		password: 'member123',
		name: 'Member User',
		role: 'member' as const,
		memberId: 'M001'
	},
	{
		id: '3',
		username: 'viewer',
		password: 'viewer123',
		name: 'Viewer User',
		role: 'viewer' as const
	}
];

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { username, password } = await request.json();

		// Validate input
		if (!username || !password) {
			return json(
				{
					success: false,
					error: 'Username dan password harus diisi'
				},
				{ status: 400 }
			);
		}

		// Find user
		const user = users.find((u) => u.username === username && u.password === password);

		if (!user) {
			return json(
				{
					success: false,
					error: 'Username atau password salah'
				},
				{ status: 401 }
			);
		}

		// Generate mock token (in real app, use JWT)
		const token = `mock-token-${user.id}-${Date.now()}`;

		// Return user data (without password)
		const userData: User = {
			id: user.id,
			username: user.username,
			name: user.name,
			role: user.role,
			memberId: user.memberId
		};

		return json({
			success: true,
			data: {
				user: userData,
				token
			}
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: 'Terjadi kesalahan server'
			},
			{ status: 500 }
		);
	}
};
