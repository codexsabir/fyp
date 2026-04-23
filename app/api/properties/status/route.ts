import { getStore } from '@/lib/store';
import { jsonError, jsonOk, readJson, requireString } from '@/app/api/_utils';

function nextVerificationCode(store: ReturnType<typeof getStore>) {
    const year = new Date().getFullYear();
    const prefix = `RPK-${year}-`;
    const nums = store.properties
        .map((p: any) => String(p.verificationCode ?? ''))
        .filter((c: string) => c.startsWith(prefix))
        .map((c: string) => Number(c.slice(prefix.length)))
        .filter((n: number) => Number.isFinite(n));
    const n = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${prefix}${String(n).padStart(3, '0')}`;
}

type Body = {
    propertyId: string;
    status: 'pending' | 'verified' | 'rejected' | 'available';
};

export async function PATCH(req: Request) {
    try {
        const store = getStore();
        const body = await readJson<Partial<Body>>(req);
        const propertyId = requireString(body.propertyId, 'propertyId');
        const statusRaw = requireString(body.status, 'status').toLowerCase();

        const idx = store.properties.findIndex((p) => p.id === propertyId);
        if (idx === -1) return jsonError('Property not found', 404);

        const status = statusRaw === 'verified' ? 'available' : statusRaw;
        if (!['pending', 'available', 'rejected'].includes(status)) return jsonError('Invalid status', 400);

        const next: any = { ...store.properties[idx], status };

        if (status === 'available') {
            next.isVerified = true;
            next.verificationCode = next.verificationCode ?? nextVerificationCode(store);
            next.verifiedAt = new Date().toISOString();
        } else {
            next.isVerified = false;
            if (status === 'pending') {
                next.verificationCode = undefined;
                next.verifiedAt = undefined;
            }
        }

        store.properties[idx] = next;
        return jsonOk({ success: true, item: next });
    } catch (e: any) {
        return jsonError(e?.message ?? 'Bad Request', 400);
    }
}
