import { getStore } from '@/lib/store';
import { jsonError, jsonOk } from '@/app/api/_utils';
import { getAuthUser } from '@/app/api/auth/_auth';

export async function GET() {
    const auth = getAuthUser();
    if (!auth?.id) return jsonError('Unauthorized', 401);
    const store = getStore();
    const u: any = store.users.find((x: any) => x.id === auth.id);
    if (!u) return jsonError('Unauthorized', 401);
    return jsonOk({ user: { id: u.id, name: u.name, email: u.email, role: u.role, verified: Boolean(u.isVerified) } });
}
