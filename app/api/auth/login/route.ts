import { getStore } from '@/lib/store';
import { jsonError, jsonOk, readJson, requireString } from '@/app/api/_utils';
import { signJwt } from '@/lib/jwt';

type Body = { email: string; password: string };

export async function POST(req: Request) {
    try {
        const store = getStore();
        const body = await readJson<Partial<Body>>(req);
        const email = requireString(body.email, 'email').toLowerCase();
        const password = requireString(body.password, 'password');

        const user: any = store.users.find((u: any) => String(u.email).toLowerCase() === email);
        if (!user) return jsonError('Invalid credentials', 401);
        if (String(user.password ?? '') !== password) return jsonError('Invalid credentials', 401);

        const token = signJwt({ id: user.id, email: user.email, role: user.role, name: user.name });
        return jsonOk({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, verified: Boolean(user.isVerified) },
        });
    } catch (e: any) {
        return jsonError(e?.message ?? 'Bad Request', 400);
    }
}
