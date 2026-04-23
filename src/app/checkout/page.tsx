'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Section } from '@/components/shared/Section';
import { Badge } from '@/components/shared/Badge';
import { PaymentModal } from '@/components/shared/PaymentModal';
import { AgreementViewer } from '@/components/shared/AgreementViewer';
import { Button } from '@/components/shared/Button';
import { moneyPKR } from '@/lib/mockData';

export default function CheckoutPage() {
	const sp = useSearchParams();
	const router = useRouter();
	const role = sp.get('role') ?? 'tenant';
	const propertyId = sp.get('propertyId') ?? 'p_1';
	const bookingIdParam = sp.get('bookingId');
	const paid = sp.get('paid') === '1';

	const [property, setProperty] = useState<any | null>(null);
	const [bookingId, setBookingId] = useState<string | null>(bookingIdParam);
	const [signed, setSigned] = useState(false);
	const [agreement, setAgreement] = useState<string>('');
	const [payOpen, setPayOpen] = useState(false);

	useEffect(() => {
		(async () => {
			const res = await fetch('/api/properties');
			const data = await res.json();
			const found = (data.items ?? []).find((p: any) => p.id === propertyId);
			setProperty(found ?? null);
			setAgreement(
				`RENTAL AGREEMENT (MOCK)\n\nProperty: ${found?.title ?? propertyId}\nRent: PKR ${moneyPKR(found?.priceMonthly ?? 0)}\n\nSigning is simulated. Payment is simulated.`
			);
		})();
	}, [propertyId]);

	const amount = useMemo(() => property?.priceMonthly ?? 0, [property]);

	async function createBooking() {
		const res = await fetch('/api/bookings', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ propertyId, tenantId: 'u_tenant_1' }),
		});
		const data = await res.json();
		setBookingId(data.item.id);
	}

	return (
		<PageShell>
			<Section title="Checkout" description="Complete booking, sign agreement and pay (mock)">
				<div className="grid gap-6 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<div className="rounded-2xl border bg-white p-5">
							<div className="flex items-start justify-between gap-3">
								<div>
									<div className="text-sm font-semibold text-slate-900">Property</div>
									<div className="mt-1 text-lg font-bold text-slate-900">{property?.title ?? 'Loading...'}</div>
									<div className="mt-1 text-sm text-slate-600">{property?.address ?? ''}</div>
								</div>
								<Badge variant={paid ? 'emerald' : 'amber'}>{paid ? 'PAID' : 'PENDING'}</Badge>
							</div>

							<div className="mt-4 rounded-xl bg-slate-50 p-4">
								<div className="text-xs font-semibold text-slate-500">Monthly rent</div>
								<div className="mt-1 text-2xl font-bold text-slate-900">PKR {moneyPKR(amount)}</div>
							</div>

							<div className="mt-4 grid gap-2 sm:grid-cols-2">
								<Button onClick={createBooking} disabled={!!bookingId}>
									{bookingId ? 'Booking created' : 'Create booking'}
								</Button>
								<Button onClick={() => setPayOpen(true)} variant="secondary" disabled={!bookingId || !signed}>
									Pay now (mock)
								</Button>
							</div>

							<div className="mt-3 text-xs text-slate-500">Role: {role} (fake login is role selector)</div>
						</div>

						<div className="mt-4">
							<AgreementViewer
								content={agreement}
								onSign={(sig) => {
									setSigned(true);
									setAgreement((a) => `${a}\n\nSigned by: ${sig}\nSigned at: ${new Date().toISOString()}`);
								}}
							/>
						</div>
					</div>

					<div className="lg:col-span-1">
						<div className="rounded-2xl border bg-white p-5">
							<div className="text-sm font-semibold text-slate-900">Progress</div>
							<div className="mt-3 grid gap-2 text-sm">
								<div className="flex items-center justify-between rounded-xl border px-3 py-2">
									<span>Create booking</span>
									<Badge variant={bookingId ? 'emerald' : 'amber'}>{bookingId ? 'Done' : 'Pending'}</Badge>
								</div>
								<div className="flex items-center justify-between rounded-xl border px-3 py-2">
									<span>Sign agreement</span>
									<Badge variant={signed ? 'emerald' : 'amber'}>{signed ? 'Done' : 'Pending'}</Badge>
								</div>
								<div className="flex items-center justify-between rounded-xl border px-3 py-2">
									<span>Pay (mock)</span>
									<Badge variant={paid ? 'emerald' : 'amber'}>{paid ? 'Done' : 'Pending'}</Badge>
								</div>
							</div>

							<div className="mt-4 text-xs text-slate-500">
								After payment, you can go back to the property.
							</div>
							<Button
								className="mt-3 w-full"
								onClick={() => router.push(`/property/${propertyId}?role=${role}`)}
								variant="ghost"
							>
								Back to property
							</Button>
						</div>
					</div>
				</div>
			</Section>

			<PaymentModal
				open={payOpen}
				amount={amount}
				bookingId={bookingId ?? ''}
				onClose={() => setPayOpen(false)}
				onPaid={(p) => {
					setPayOpen(false);
					router.push(
						`/checkout?role=${role}&propertyId=${propertyId}&bookingId=${bookingId}&paid=1&txn=${p.transactionId}`
					);
				}}
			/>
		</PageShell>
	);
}
