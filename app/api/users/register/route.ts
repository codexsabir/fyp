import { getStore } from '@/lib/store';
import { jsonError, jsonOk, readJson, requireString } from '@/app/api/_utils';

const CNIC_RE = /^\d{5}-\d{7}-\d{1}$/;

type Body = {
    name: string;
    email: string;
    role: 'tenant' | 'landlord';
    cnic: string;
    cnicFrontUrl?: string;
    cnicBackUrl?: string;
};

export async function POST(req: Request) {
    try {
        const store = getStore();
        const body = await readJson<Partial<Body>>(req);

        const name = requireString(body.name, 'name');
        const email = requireString(body.email, 'email');
        const role = (body.role ?? 'tenant') as Body['role'];
        const cnic = requireString(body.cnic, 'cnic');
        if (!CNIC_RE.test(cnic)) return jsonError('Invalid CNIC format. Use XXXXX-XXXXXXX-X', 400);
        if (role !== 'tenant' && role !== 'landlord') return jsonError('Invalid role', 400);

        const emailTaken = store.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (emailTaken) return jsonError('Email already registered', 409);

        const id = `u_${Date.now()}`;
        const user = {
            id,
            name,
            email,
            role,
            cnic,
            isVerified: false,
            verificationStatus: 'pending' as const,
            createdAt: new Date().toISOString(),
        };
        store.users.unshift(user as any);

        const now = new Date().toISOString();
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

        return jsonOk({ success: true, item: user });
    } catch (e: any) {
        return jsonError(e?.message ?? 'Bad Request', 400);
    }
}
