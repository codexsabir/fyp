import { getStore } from '@/lib/store';
import { jsonError, jsonOk, readJson, requireString } from '@/app/api/_utils';
import { signJwt } from '@/lib/jwt';

const CNIC_RE = /^\d{5}-\d{7}-\d{1}$/;

type Body = {
    role: 'tenant' | 'landlord';
    name: string;
    cnic: string;
    cnicFrontUrl?: string;
    cnicBackUrl?: string;
    email: string;
    password: string;
};

export async function POST(req: Request) {
    try {
        const store = getStore();
        const body = await readJson<Partial<Body>>(req);

        const role = (body.role ?? 'tenant') as Body['role'];
        if (role !== 'tenant' && role !== 'landlord') return jsonError('Invalid role', 400);

        const name = requireString(body.name, 'name');
        const cnic = requireString(body.cnic, 'cnic');
        if (!CNIC_RE.test(cnic)) return jsonError('Invalid CNIC format. Use XXXXX-XXXXXXX-X', 400);

        const email = requireString(body.email, 'email').toLowerCase();
        const password = requireString(body.password, 'password');
        if (password.length < 4) return jsonError('Password too short', 400);

        const emailTaken = store.users.some((u: any) => String(u.email).toLowerCase() === email);
        if (emailTaken) return jsonError('Email already registered', 409);

        const id = `u_${Date.now()}`;
        const now = new Date().toISOString();
        const user: any = {
            id,
            name,
            email,
            password,
            role,
            cnic,
            verified: false,
            isVerified: false,
            verificationStatus: 'pending',
            createdAt: now,
        };
        store.users.unshift(user);

        store.verifications.unshift({
            id: `v_${Date.now()}`,
            userId: id,
            cnic,
            frontUrl: body.cnicFrontUrl,
            backUrl: body.cnicBackUrl,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        });

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
