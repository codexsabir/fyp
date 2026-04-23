import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockStore';

export async function GET(req: Request) {
    const store = getStore();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const landlordId = searchParams.get('landlordId');

    let items = [...store.bookings];
    if (tenantId) items = items.filter((b) => b.tenantId === tenantId);
    if (landlordId) {
        const landlordPropertyIds = new Set(store.properties.filter((p) => p.landlordId === landlordId).map((p) => p.id));
        items = items.filter((b) => landlordPropertyIds.has(b.propertyId));
    }

    return NextResponse.json({ items });
}

export async function POST(req: Request) {
    const store = getStore();
    const body = await req.json();

    const item = {
        id: `b_${Date.now()}`,
        propertyId: String(body?.propertyId),
        tenantId: String(body?.tenantId ?? 'u_tenant_1'),
        status: 'pending' as const,
        startDate: String(body?.startDate ?? new Date().toISOString()),
        endDate: String(body?.endDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
        createdAt: new Date().toISOString(),
    };
    store.bookings.unshift(item);

    // ensure agreement exists in mock store
    store.agreements.unshift({
        id: `a_${Date.now()}`,
        bookingId: item.id,
        propertyId: item.propertyId,
        landlordId: store.properties.find((p) => p.id === item.propertyId)?.landlordId ?? 'u_landlord_1',
        tenantId: item.tenantId,
        status: 'draft',
        content:
            "RENTAL AGREEMENT (MOCK)\n\nThis is a system-generated mock agreement.\n\nTenant agrees to pay monthly rent and follow rules.\n\nSigning is simulated in UI.",
    });

    return NextResponse.json({ success: true, item });
}

export async function PATCH(req: Request) {
    const store = getStore();
    const body = await req.json();
    const id = String(body?.id ?? '');
    const idx = store.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    store.bookings[idx] = { ...store.bookings[idx], ...body };
    return NextResponse.json({ success: true, item: store.bookings[idx] });
}
