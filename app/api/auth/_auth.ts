import { headers } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export type AuthUser = { userId: string; role: 'tenant' | 'landlord' | 'admin' };

export async function getAuthUser(): Promise<AuthUser | null> {
	const h = await headers();
	const auth = h.get('authorization') ?? '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
	if (!token) return null;
	try {
		const payload = verifyToken(token);
		return { userId: payload.userId, role: payload.role };
	} catch {
		return null;
	}
}
