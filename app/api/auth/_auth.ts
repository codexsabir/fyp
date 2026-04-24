import { headers } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export function getAuthUser() {
    const h = headers();
    const auth = h.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return null;
    const v = verifyJwt(token);
    if (!v.valid) return null;
    return v.payload as { id: string; role: string; email: string; name?: string };
}
