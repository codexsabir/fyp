import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function POST(req: Request) {
	const store = getStore();
	const body = await req.json();
	const cnic = String(body?.cnic ?? '');
	const normalized = cnic.replace(/\D/g, '');
	const verified = normalized.length === 13;

	if (verified) {
		const userId = body?.userId ? String(body.userId) : undefined;
		if (userId) {
			const idx = store.users.findIndex((u) => u.id === userId);
			if (idx !== -1) store.users[idx] = { ...store.users[idx], isVerified: true };
		} else {
			const idx = store.users.findIndex((u) => u.cnic.replace(/\D/g, '') === normalized);
			if (idx !== -1) store.users[idx] = { ...store.users[idx], isVerified: true };
		}
	}

	return NextResponse.json({
		success: true,
		verified,
		message: verified ? 'CNIC verified (in-memory)' : 'Invalid CNIC format (mock)',
	});
}
