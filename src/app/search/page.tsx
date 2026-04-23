'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Section } from '@/components/shared/Section';

export default function SearchPage() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'tenant';

	const [q, setQ] = useState(sp.get('q') ?? '');
	const [city, setCity] = useState(sp.get('city') ?? '');
	const [status, setStatus] = useState(sp.get('status') ?? 'available');
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	async function load() {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			if (q) params.set('q', q);
			if (city) params.set('city', city);
			if (status) params.set('status', status);
			const res = await fetch(`/api/properties?${params.toString()}`);
			const data = await res.json();
			setItems(data.items ?? []);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const title = useMemo(() => (status === 'available' ? 'Available Properties' : 'Properties'), [status]);

	return (
		<PageShell>
			<Section title={title} description="Search and filter listings (mock data)">
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
						<Select value={status} onChange={(e) => setStatus(e.target.value)}>
							<option value="available">Available</option>
							<option value="pending">Pending</option>
							<option value="rented">Rented</option>
						</Select>
					</div>
					<div className="md:col-span-4">
						<button
							onClick={load}
							className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
						>
							{loading ? 'Loading...' : 'Search'}
						</button>
					</div>
				</div>
			</Section>

			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((p) => (
					<PropertyCard key={p.id} property={p} role={role} />
				))}
			</div>

			{!loading && items.length === 0 ? (
				<div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-slate-600">No results.</div>
			) : null}
		</PageShell>
	);
}
