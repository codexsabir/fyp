import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(req: Request) {
	const store = getStore();
	const { searchParams } = new URL(req.url);
	const q = (searchParams.get('q') ?? '').toLowerCase();
	const city = (searchParams.get('city') ?? '').toLowerCase();
	const status = (searchParams.get('status') ?? '').toLowerCase();
	const role = (searchParams.get('role') ?? 'tenant').toLowerCase();

	let items = [...store.properties];

	// tenant visibility: only approved/available
	if (role === 'tenant') {
		items = items.filter((p) => p.status === 'available' || p.status === 'approved');
	}

	if (q) {
		items = items.filter((p) =>
			[p.title, p.description, p.area, p.city, p.address].some((x) => String(x).toLowerCase().includes(q))
		);
	}
	if (city) items = items.filter((p) => p.city.toLowerCase() === city);
	if (status) items = items.filter((p) => p.status.toLowerCase() === status);

	return NextResponse.json({ items });
}

export async function POST(req: Request) {
	const store = getStore();
	const body = await req.json();

	const item = {
		id: `p_${Date.now()}`,
		title: String(body?.title ?? 'New Property'),
		description: String(body?.description ?? ''),
		priceMonthly: Number(body?.priceMonthly ?? body?.price ?? 0),
		city: String(body?.city ?? 'Lahore'),
		area: String(body?.area ?? 'Unknown'),
		address: String(body?.address ?? body?.location ?? ''),
		bedrooms: Number(body?.bedrooms ?? 1),
		bathrooms: Number(body?.bathrooms ?? 1),
		propertyType: (body?.propertyType ?? 'Apartment') as 'House' | 'Apartment' | 'Portion' | 'Office',
		images: Array.isArray(body?.images) ? body.images : [],
		landlordId: String(body?.landlordId ?? 'u_landlord_1'),
		status: 'pending' as const,
		isVerified: false,
		createdAt: new Date().toISOString(),
	};

	store.properties.unshift(item);
	return NextResponse.json({ success: true, item });
}

export async function PATCH(req: Request) {
	const store = getStore();
	const body = await req.json();
	const id = String(body?.id ?? '');
	const idx = store.properties.findIndex((p) => p.id === id);
	if (idx === -1) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

	store.properties[idx] = { ...store.properties[idx], ...body };
	return NextResponse.json({ success: true, item: store.properties[idx] });
}
