'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { PaymentModal } from '@/components/shared/PaymentModal';
import { AgreementViewer } from '@/components/shared/AgreementViewer';
import { moneyPKR } from '@/lib/mockData';

export default function PropertyDetailsPage() {
	const params = useParams<{ id: string }>();
	const sp = useSearchParams();
	const router = useRouter();
	const role = sp.get('role') ?? 'tenant';

	const [property, setProperty] = useState<any | null>(null);
	const [bookingId, setBookingId] = useState<string | null>(null);
	const [agreementContent, setAgreementContent] = useState<string>('');
	const [signed, setSigned] = useState(false);
	const [payOpen, setPayOpen] = useState(false);

	const id = params.id;

	useEffect(() => {
		(async () => {
			const res = await fetch('/api/properties');
			const data = await res.json();
			const found = (data.items ?? []).find((p: any) => p.id === id);
			setProperty(found ?? null);
		})();
	}, [id]);

	const statusVariant = useMemo(() => {
		if (!property) return 'slate';
		if (property.status === 'available') return 'emerald';
		if (property.status === 'pending') return 'amber';
		if (property.status === 'rented') return 'rose';
		return 'slate';
	}, [property]);

	async function book() {
		const res = await fetch('/api/bookings', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ propertyId: id, tenantId: 'u_tenant_1' }),
		});
		const data = await res.json();
		setBookingId(data.item.id);
		setAgreementContent(
			`RENTAL AGREEMENT (MOCK)\n\nProperty: ${property.title}\nMonthly Rent: PKR ${moneyPKR(property.priceMonthly)}\n\n1) CNIC Verification: mock\n2) Documents: mock uploads\n3) Payment: Easypaisa/JazzCash (mock)\n\nSign below to proceed.`
		);
	}

	function onSign(signature: string) {
		setSigned(true);
		setAgreementContent((c) => `${c}\n\nSigned by: ${signature}\nSigned at: ${new Date().toISOString()}`);
	}

	if (!property) {
		return (
			<PageShell>
				<div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">Loading property...</div>
			</PageShell>
		);
	}

	return (
		<PageShell>
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<div className="overflow-hidden rounded-2xl border bg-white">
						<img src={property.images?.[0]} alt={property.title} className="h-72 w-full object-cover" />
						<div className="p-5">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div>
									<div className="text-2xl font-bold text-slate-900">{property.title}</div>
									<div className="mt-1 text-sm text-slate-600">
										{property.address}
									</div>
								</div>
								<Badge variant={statusVariant as any}>{String(property.status).toUpperCase()}</Badge>
							</div>

							<div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
								<div>
									<div className="text-xs font-semibold text-slate-500">Rent</div>
									<div className="mt-1 text-lg font-bold text-slate-900">PKR {moneyPKR(property.priceMonthly)}</div>
								</div>
								<div>
									<div className="text-xs font-semibold text-slate-500">Beds/Baths</div>
									<div className="mt-1 text-sm font-semibold text-slate-900">
										{property.bedrooms} / {property.bathrooms}
									</div>
								</div>
								<div>
									<div className="text-xs font-semibold text-slate-500">Verified</div>
									<div className="mt-1 text-sm font-semibold text-slate-900">
										{property.isVerified ? 'Yes' : 'No (mock)'}
									</div>
								</div>
							</div>

							<p className="mt-4 text-sm leading-6 text-slate-700">{property.description}</p>
						</div>
					</div>
				</div>

				<div className="lg:col-span-1">
					<div className="rounded-2xl border bg-white p-5">
						<div className="text-sm font-semibold text-slate-900">Tenant actions</div>
						<div className="mt-2 text-xs text-slate-500">Role: {role} (UI-only)</div>

						<div className="mt-4 grid gap-2">
							<Button
								onClick={() => router.push(`/checkout?propertyId=${id}&role=${role}`)}
								variant="secondary"
							>
								Go to checkout
							</Button>
							<Button onClick={book} disabled={!!bookingId}>
								{bookingId ? 'Booked (mock)' : 'Book property'}
							</Button>
							<Button onClick={() => setPayOpen(true)} disabled={!bookingId || !signed}>
								Pay rent (mock)
							</Button>
						</div>

						<div className="mt-4 text-xs text-slate-500">
							Flow: Book → Sign agreement → Pay → Completed
						</div>
					</div>

					{bookingId ? (
						<div className="mt-4">
							<AgreementViewer content={agreementContent} onSign={onSign} />
						</div>
					) : null}
				</div>
			</div>

			<PaymentModal
				open={payOpen}
				amount={property.priceMonthly}
				bookingId={bookingId ?? ''}
				onClose={() => setPayOpen(false)}
				onPaid={(p) => {
					setPayOpen(false);
					router.push(`/checkout?role=${role}&propertyId=${id}&bookingId=${bookingId}&paid=1&txn=${p.transactionId}`);
				}}
			/>
		</PageShell>
	);
}
