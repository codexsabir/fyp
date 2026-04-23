import { getStore } from '@/lib/store';
import { jsonError, jsonOk, readJson, requireString } from '@/app/api/_utils';

type Body = {
    userId: string;
    status: 'verified' | 'rejected';
    note?: string;
};

export async function PATCH(req: Request) {
    try {
        const store = getStore();
        const body = await readJson<Partial<Body>>(req);
        const userId = requireString(body.userId, 'userId');
        const status = body.status;
        if (status !== 'verified' && status !== 'rejected') return jsonError('Invalid status', 400);

        const uIdx = store.users.findIndex((u) => u.id === userId);
        if (uIdx === -1) return jsonError('User not found', 404);

        store.users[uIdx] = {
            ...store.users[uIdx],
            isVerified: status === 'verified',
            verificationStatus: status,
            verificationNote: body.note,
            verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        } as any;

        const vIdx = store.verifications.findIndex((v) => v.userId === userId);
        if (vIdx !== -1) {
            store.verifications[vIdx] = { ...store.verifications[vIdx], status, updatedAt: new Date().toISOString() };
        }

        return jsonOk({ success: true, item: store.users[uIdx] });
    } catch (e: any) {
        return jsonError(e?.message ?? 'Bad Request', 400);
    }
}
