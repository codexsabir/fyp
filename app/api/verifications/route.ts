import { getStore } from '@/lib/store';
import { jsonOk } from '@/app/api/_utils';

export async function GET() {
    const store = getStore();
    const items = store.verifications.map((v) => ({
        ...v,
        user: store.users.find((u) => u.id === v.userId),
    }));
    return jsonOk({ items });
}
