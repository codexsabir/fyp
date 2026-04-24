import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function POST(req: Request) {
	const store = getStore();
	let body: any = {};
	try {
		body = await req.json();
	} catch {
		body = {};
	}

	const url = `https://dummyimage.com/1200x800/e5e7eb/111827&text=RentP+Upload+${Date.now()}`;
	const doc = {
		id: `d_${Date.now()}`,
		ownerType: 'user' as const,
		ownerId: String(body?.userId ?? 'u_landlord_1'),
		category: String(body?.category ?? 'other'),
		name: String(body?.name ?? 'Upload'),
		url,
		verified: false,
		createdAt: new Date().toISOString(),
	};
	store.documents.unshift(doc as any);

	return NextResponse.json({ success: true, url });
}
