import { headers } from 'next/headers';
import { verifyJwt, type JwtUser } from '@/lib/jwt';

export function getAuthUser(): JwtUser | null {
	const h = headers();
	const auth = h.get('authorization') ?? '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
	if (!token) return null;
	try {
		return verifyJwt(token);
	} catch {
		return null;
	}
}
