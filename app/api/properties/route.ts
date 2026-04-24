import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PropertyModel from '@/models/Property';
import { getAuthUser } from '@/app/api/auth/_auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
	await connectDB();
	const { searchParams } = new URL(req.url);
	const q = (searchParams.get('q') ?? '').trim();
	const city = (searchParams.get('city') ?? '').trim();

	const filter: any = {};
	if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
	if (city) filter.city = { $regex: `^${city}$`, $options: 'i' };

	const items = await PropertyModel.find(filter).sort({ createdAt: -1 }).lean();
	return NextResponse.json({ items: items.map((p: any) => ({ ...p, id: String(p._id) })) });
}

export async function POST(req: Request) {
	const auth = getAuthUser();
	if (!auth?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
	if (auth.role !== 'landlord') return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

	await connectDB();
	const body: any = await req.json();
	const title = String(body?.title ?? '').trim();
	const city = String(body?.city ?? '').trim();
	const description = String(body?.description ?? '').trim();
	const priceMonthly = Number(body?.priceMonthly ?? body?.price ?? 0);
	const images = Array.isArray(body?.images) ? body.images.map(String) : [];

	if (!title) return NextResponse.json({ success: false, message: 'Missing field: title' }, { status: 400 });
	if (!city) return NextResponse.json({ success: false, message: 'Missing field: city' }, { status: 400 });
	if (!description) return NextResponse.json({ success: false, message: 'Missing field: description' }, { status: 400 });
	if (!Number.isFinite(priceMonthly) || priceMonthly <= 0)
		return NextResponse.json({ success: false, message: 'Invalid field: priceMonthly' }, { status: 400 });

	const item: any = await PropertyModel.create({
		title,
		city,
		description,
		priceMonthly,
		images,
		ownerId: auth.id,
		verificationStatus: 'pending',
	});

	return NextResponse.json({ success: true, item: { ...item.toObject(), id: String(item._id) } });
}

export async function PATCH(req: Request) {
	const auth = getAuthUser();
	if (!auth?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

	await connectDB();
	const body: any = await req.json();
	const id = String(body?.id ?? '').trim();
	if (!id) return NextResponse.json({ success: false, message: 'Missing field: id' }, { status: 400 });

	const found: any = await PropertyModel.findById(id);
	if (!found) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

	const isOwner = String(found.ownerId) === auth.id;
	if (!isOwner && auth.role !== 'admin') return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });

	const allowed: any = {};
	if (typeof body.title === 'string') allowed.title = body.title;
	if (typeof body.city === 'string') allowed.city = body.city;
	if (typeof body.description === 'string') allowed.description = body.description;
	if (body.priceMonthly != null) allowed.priceMonthly = Number(body.priceMonthly);
	if (Array.isArray(body.images)) allowed.images = body.images.map(String);

	Object.assign(found, allowed);
	await found.save();
	return NextResponse.json({ success: true, item: { ...found.toObject(), id: String(found._id) } });
}
