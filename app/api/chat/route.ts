import { getStore } from '@/lib/store';
import { jsonOk } from '@/app/api/_utils';

export async function GET(req: Request) {
    const store = getStore();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') ?? undefined;
    const propertyId = searchParams.get('propertyId') ?? undefined;

    let items = store.chats;
    if (propertyId) items = items.filter((c) => c.propertyId === propertyId);
    if (userId) items = items.filter((c) => c.participants.includes(userId));

    return jsonOk({ items });
}
