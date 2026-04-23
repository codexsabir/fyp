import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockStore';

export async function GET(req: Request) {
    const store = getStore();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');
    const items = bookingId ? store.agreements.filter((a) => a.bookingId === bookingId) : store.agreements;
    return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
    const store = getStore();
    const body = await req.json();
    const id = String(body?.id ?? '');
    const idx = store.agreements.findIndex((a) => a.id === id);
    if (idx === -1) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    store.agreements[idx] = { ...store.agreements[idx], ...body };
    return NextResponse.json({ success: true, item: store.agreements[idx] });
}
