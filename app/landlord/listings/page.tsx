'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Section } from '@/components/shared/Section';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/shared/Badge';
import { moneyPKR } from '@/lib/mockData';

export default function LandlordListings() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'landlord';
	const landlordId = 'u_landlord_1';

	const [items, setItems] = useState<any[]>([]);

	async function load() {
		const res = await fetch('/api/properties');
		const data = await res.json();
		setItems((data.items ?? []).filter((p: any) => p.landlordId === landlordId));
	}

	useEffect(() => {
		load();
	}, []);

	const rows = useMemo(
		() =>
			items.map((p) => [
				<div key={p.id}>
					<div className="font-semibold text-slate-900">{p.title}</div>
					<div className="text-xs text-slate-500">{p.area}, {p.city}</div>
				</div>,
				`PKR ${moneyPKR(p.priceMonthly)}`,
				<Badge key={`${p.id}-b`} variant={p.status === 'available' ? 'emerald' : p.status === 'pending' ? 'amber' : 'slate'}>
					{String(p.status).toUpperCase()}
				</Badge>,
				p.isVerified ? 'Yes' : 'No',
			]);
		,
		[items]
	);

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
					<Section title="Your listings" description={`Role: ${role} (UI-only mock)`}>
						<Table head={['Property', 'Rent', 'Status', 'Verified']} rows={rows} />
						<div className="mt-3 text-xs text-slate-500">Admin can approve/reject from Admin panel.</div>
					</Section>
				</div>
			</div>
		</PageShell>
	);
}
