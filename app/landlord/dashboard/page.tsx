'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Section } from '@/components/shared/Section';
import { StatCard } from '@/components/shared/StatCard';
import { useUser } from '@/context/UserContext';

export default function LandlordDashboard() {
	const router = useRouter();
	const { currentUser } = useUser();
	const [properties, setProperties] = useState<any[]>([]);
	const [bookings, setBookings] = useState<any[]>([]);

	useEffect(() => {
		if (!currentUser) {
			router.push('/login');
			return;
		}
		if (currentUser.role !== 'landlord') {
			router.push('/');
			return;
		}

		(async () => {
			const p = await fetch('/api/properties').then((r) => r.json());
			setProperties((p.items ?? []).filter((x: any) => x.landlordId === currentUser.id));
			const b = await fetch(`/api/bookings?landlordId=${currentUser.id}`).then((r) => r.json());
			setBookings(b.items ?? []);
		})();
	}, [currentUser, router]);

	const pending = useMemo(() => properties.filter((p) => p.status === 'pending').length, [properties]);
	const available = useMemo(() => properties.filter((p) => p.status === 'available' || p.status === 'approved').length, [properties]);

	return (
		<PageShell>
			<div className="grid gap-6 md:grid-cols-[260px_1fr]">
				<Sidebar
					title="Landlord"
					items={[
						{ href: '/landlord/dashboard', label: 'Dashboard' },
						{ href: '/landlord/add-property', label: 'Add property' },
						{ href: '/landlord/listings', label: 'Listings' },
					]}
				/>
				<div>
					<Section title="Landlord dashboard" description="Manage your listings and tenant requests">
						<div className="grid gap-4 sm:grid-cols-3">
							<StatCard label="Your listings" value={String(properties.length)} accent="blue" />
							<StatCard label="Pending verification" value={String(pending)} accent="amber" />
							<StatCard label="Available" value={String(available)} accent="emerald" />
						</div>
						<div className="mt-4">
							<Link
								href="/landlord/add-property"
								className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
							>
								Add new property
							</Link>
						</div>
					</Section>

					<div className="mt-6 rounded-2xl border bg-white p-5">
						<div className="text-sm font-semibold text-slate-900">Tenant requests</div>
						<div className="mt-2 text-sm text-slate-600">Bookings for your properties.</div>
						<div className="mt-4 space-y-2">
							{bookings.map((b) => (
								<div key={b.id} className="flex items-center justify-between rounded-xl border px-3 py-3">
									<div>
										<div className="text-sm font-semibold text-slate-900">Booking #{b.id}</div>
										<div className="text-xs text-slate-600">Property: {b.propertyId} • Status: {b.status}</div>
									</div>
									<div className="flex gap-2">
										<button
											className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
											onClick={async () => {
												await fetch('/api/bookings', {
													method: 'PATCH',
													headers: { 'content-type': 'application/json' },
													body: JSON.stringify({ id: b.id, status: 'approved' }),
												});
												setBookings((x) => x.map((y) => (y.id === b.id ? { ...y, status: 'approved' } : y)));
											}}
										>
											Approve
										</button>
										<button
											className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
											onClick={async () => {
												await fetch('/api/bookings', {
													method: 'PATCH',
													headers: { 'content-type': 'application/json' },
													body: JSON.stringify({ id: b.id, status: 'rejected' }),
												});
												setBookings((x) => x.map((y) => (y.id === b.id ? { ...y, status: 'rejected' } : y)));
											}}
										>
											Reject
										</button>
									</div>
								</div>
							))}
							{bookings.length === 0 ? (
								<div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">No requests yet.</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</PageShell>
	);
}
