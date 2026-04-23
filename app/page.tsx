'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { PageShell } from '@/components/shared/PageShell';
import { Section } from '@/components/shared/Section';

export default function Home() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'tenant';

	const [q, setQ] = useState('');
	const [city, setCity] = useState('');
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	async function load() {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			params.set('role', role);
			if (q) params.set('q', q);
			if (city) params.set('city', city);
			params.set('status', 'available');
			const res = await fetch(`/api/properties?${params.toString()}`, { cache: 'no-store' });
			const data = await res.json();
			setItems(data.items ?? []);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
		const t = setInterval(load, 2000); // realtime-like
		return () => clearInterval(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [role]);

	const title = useMemo(() => (role === 'tenant' ? 'Approved properties' : 'All properties'), [role]);

	return (
		<div className="min-h-screen bg-slate-50">
			<PageShell>
				<Section
					title="RentP"
					description="UI-first rental platform (in-memory store + realtime-like updates)"
				>
					<div className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-4">
						<div className="md:col-span-2">
							<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, area, city..." />
						</div>
						<div>
							<Select value={city} onChange={(e) => setCity(e.target.value)}>
								<option value="">All cities</option>
								<option value="Lahore">Lahore</option>
								<option value="Karachi">Karachi</option>
								<option value="Islamabad">Islamabad</option>
							</Select>
						</div>
						<div>
							<Link
								href={role === 'landlord' ? `/landlord/add-property?role=${role}` : `/search?role=${role}`}
								className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
							>
								{role === 'landlord' ? 'Add property' : 'Browse'}
							</Link>
						</div>

						<div className="md:col-span-4">
							<button
								onClick={load}
								className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
							>
								{loading ? 'Loading...' : 'Refresh'}
							</button>
						</div>
					</div>
				</Section>

				<div className="mt-6">
					<div className="text-sm font-semibold text-slate-700">{title}</div>
					<div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((p) => (
							<PropertyCard key={p.id} property={p} role={role} />
						))}
					</div>

					{!loading && items.length === 0 ? (
						<div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-slate-600">No properties yet.</div>
					) : null}
				</div>
			</PageShell>
		</div>
	);
}
