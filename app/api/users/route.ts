import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockStore';

export async function GET() {
    const store = getStore();
    return NextResponse.json({ items: store.users });
}

export async function POST(req: Request) {
    const store = getStore();
    const body = await req.json();
    const user = {
        id: `u_${Date.now()}`,
        name: String(body?.name ?? 'New User'),
        email: String(body?.email ?? `user${Date.now()}@rentp.pk`),
        role: (body?.role ?? 'tenant') as 'admin' | 'landlord' | 'tenant',
        cnic: String(body?.cnic ?? '0000000000000'),
        isVerified: false,
    };
    store.users.unshift(user);
    return NextResponse.json({ success: true, item: user });
}
