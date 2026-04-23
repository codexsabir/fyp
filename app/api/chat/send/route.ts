import { getStore } from '@/lib/store';
import { jsonError, jsonOk, readJson, requireString } from '@/app/api/_utils';

type Body = {
    propertyId?: string;
    senderId: string;
    receiverId: string;
    text: string;
};

export async function POST(req: Request) {
    try {
        const store = getStore();
        const body = await readJson<Partial<Body>>(req);
        const senderId = requireString(body.senderId, 'senderId');
        const receiverId = requireString(body.receiverId, 'receiverId');
        const text = requireString(body.text, 'text');
        const propertyId = body.propertyId ? String(body.propertyId) : undefined;

        const participants = [senderId, receiverId].sort();
        let chat = store.chats.find(
            (c) =>
                (c.propertyId ?? undefined) === (propertyId ?? undefined) &&
                c.participants.length === 2 &&
                [...c.participants].sort().join('|') === participants.join('|')
        );

        const now = new Date().toISOString();
        if (!chat) {
            chat = {
                id: `c_${Date.now()}`,
                propertyId,
                participants,
                messages: [],
                createdAt: now,
                updatedAt: now,
            };
            store.chats.unshift(chat);
        }

        const msg = { id: `m_${Date.now()}`, senderId, text, createdAt: now };
        chat.messages.push(msg);
        chat.updatedAt = now;

        return jsonOk({ success: true, chat, message: msg });
    } catch (e: any) {
        return jsonError(e?.message ?? 'Bad Request', 400);
    }
}
