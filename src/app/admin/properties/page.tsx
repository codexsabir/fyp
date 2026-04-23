'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Section } from '@/components/shared/Section';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminProperties() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'admin';
	const [items, setItems] = useState<any[]>([]);

	async function load() {
		const res = await fetch('/api/properties');
		const data = await res.json();
		setItems(data.items ?? []);
	}

	useEffect(() => {
		load();
	}, []);

	async function setStatus(id: string, status: 'available' | 'rejected' | 'pending') {
		await fetch('/api/properties', {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ id, status, isVerified: status === 'available' }),
		});
		setItems((xs) => xs.map((p) => (p.id === id ? { ...p, status, isVerified: status === 'available' } : p)));
	}

	const rows = useMemo(
		() =>
			items.map((p) => [
				<div key={p.id}>
					<div className="font-semibold text-slate-900">{p.title}</div>
					<div className="text-xs text-slate-500">{p.area}, {p.city}</div>
				</div>,
				<Badge key={`${p.id}-s`} variant={p.status === 'available' ? 'emerald' : p.status === 'pending' ? 'amber' : 'rose'}>
					{String(p.status).toUpperCase()}
				</Badge>,
				p.isVerified ? 'Yes' : 'No',
				<div key={`${p.id}-a`} className="flex flex-wrap gap-2">
					<Button variant="secondary" onClick={() => setStatus(p.id, 'available')}>Approve</Button>
					<Button variant="secondary" onClick={() => setStatus(p.id, 'rejected')}>Reject</Button>
					<Button variant="ghost" onClick={() => setStatus(p.id, 'pending')}>Set pending</Button>
				</div>,
			]);
		,
		[items]
	);

	return (
		<PageShell>
			<div className="grid gap-6 md:grid-cols-[260px_1fr]">
				<Sidebar
					title="Admin"
					items={[
						{ href: '/admin/dashboard', label: 'Dashboard' },
						{ href: '/admin/properties', label: 'Verify properties' },
						{ href: '/admin/users', label: 'Verify users' },
					]}
				/>
				<div>
					<Section title="Verify properties" description={`Approve/reject listings (mock). Role: ${role}`}>
						<Table head={['Property', 'Status', 'Verified', 'Actions']} rows={rows} />
					</Section>
				</div>
			</div>
		</PageShell>
	);
}
