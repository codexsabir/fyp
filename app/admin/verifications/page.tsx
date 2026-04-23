'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Section } from '@/components/shared/Section';
import { Sidebar } from '@/components/layout/Sidebar';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminVerificationsPage() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'admin';
	const [items, setItems] = useState<any[]>([]);

	async function load() {
		const res = await fetch('/api/verifications', { cache: 'no-store' });
		const data = await res.json();
		setItems(data.items ?? []);
	}

	useEffect(() => {
		load();
		const t = setInterval(load, 2500);
		return () => clearInterval(t);
	}, []);

	async function setUserStatus(userId: string, status: 'verified' | 'rejected') {
		await fetch('/api/users/verify', {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ userId, status }),
		});
		await load();
	}

	const rows = useMemo(
		() =>
			items.map((v) => {
				const u = v.user;
				return [
					<div key={`${v.id}-u`}>
						<div className="font-semibold text-slate-900">{u?.name ?? v.userId}</div>
						<div className="text-xs text-slate-500">{u?.email ?? ''}</div>
					</div>,
					v.cnic,
					<Badge
						key={`${v.id}-s`}
						variant={v.status === 'verified' ? 'emerald' : v.status === 'rejected' ? 'rose' : 'amber'}
					>
						{String(v.status).toUpperCase()}
					</Badge>,
					<div key={`${v.id}-a`} className="flex flex-wrap gap-2">
						<Button variant="secondary" onClick={() => setUserStatus(v.userId, 'verified')}>
							Verify
						</Button>
						<Button variant="secondary" onClick={() => setUserStatus(v.userId, 'rejected')}>
							Reject
						</Button>
					</div>,
				];
			}),
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
						{ href: '/admin/users', label: 'Users' },
						{ href: '/admin/verifications', label: 'User verifications' },
					]}
				/>
				<div>
					<Section title="User verifications" description={`Approve/reject CNIC onboarding. Role: ${role} (mock)`}>
						<Table head={['User', 'CNIC', 'Status', 'Actions']} rows={rows} />
					</Section>
				</div>
			</div>
		</PageShell>
	);
}
