import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(req: Request) {
	const store = getStore();
	const { searchParams } = new URL(req.url);
	const bookingId = searchParams.get('bookingId');
	const items = bookingId ? store.payments.filter((p) => p.bookingId === bookingId) : store.payments;
	return NextResponse.json({ items });
}

export async function POST(req: Request) {
	const store = getStore();
	const body = await req.json();
	const amount = Number(body?.amount ?? 0);
	const method = (body?.method ?? 'Easypaisa') as 'Easypaisa' | 'JazzCash';
	const bookingId = String(body?.bookingId ?? '');

	const payment = {
		id: `pay_${Date.now()}`,
		bookingId,
		amount,
		method,
		status: 'success' as const,
		transactionId: `TXN-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
		createdAt: new Date().toISOString(),
	};
	store.payments.unshift(payment);

	const bookingIdx = store.bookings.findIndex((b) => b.id === bookingId);
	if (bookingIdx !== -1) store.bookings[bookingIdx] = { ...store.bookings[bookingIdx], status: 'paid' };

	return NextResponse.json({ success: true, item: payment });
}
