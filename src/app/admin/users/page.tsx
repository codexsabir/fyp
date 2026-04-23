'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Section } from '@/components/shared/Section';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/shared/Badge';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';

export default function AdminUsers() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'admin';
	const [items, setItems] = useState<any[]>([]);
	const [cnic, setCnic] = useState('');
	const [verifying, setVerifying] = useState(false);
	const [verifyResult, setVerifyResult] = useState<string>('');

	async function load() {
		const res = await fetch('/api/users');
		const data = await res.json();
		setItems(data.items ?? []);
	}

	useEffect(() => {
		load();
	}, []);

	async function verifyCnic() {
		setVerifying(true);
		setVerifyResult('');
		try {
			const res = await fetch('/api/verify', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ cnic }),
			});
			const data = await res.json();
			setVerifyResult(data.message);
		} finally {
			setVerifying(false);
		}
	}

	async function markVerified(id: string, isVerified: boolean) {
		// mock user update through local state; API stays mocked
		setItems((xs) => xs.map((u) => (u.id === id ? { ...u, isVerified } : u)));
	}

	const rows = useMemo(
		() =>
			items.map((u) => [
				<div key={u.id}>
					<div className="font-semibold text-slate-900">{u.name}</div>
					<div className="text-xs text-slate-500">{u.email} • {u.role}</div>
				</div>,
				u.cnic,
				<Badge key={`${u.id}-v`} variant={u.isVerified ? 'emerald' : 'amber'}>{u.isVerified ? 'VERIFIED' : 'PENDING'}</Badge>,
				<div key={`${u.id}-a`} className="flex gap-2">
					<Button variant="secondary" onClick={() => markVerified(u.id, true)}>Mark verified</Button>
					<Button variant="ghost" onClick={() => markVerified(u.id, false)}>Mark pending</Button>
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
					<Section title="Verify users" description={`CNIC verification is mocked. Role: ${role}`}>
						<div className="mb-4 grid gap-2 rounded-2xl border bg-white p-4 md:grid-cols-[1fr_auto]">
							<Input value={cnic} onChange={(e) => setCnic(e.target.value)} placeholder="Enter CNIC (13 digits)" />
							<Button onClick={verifyCnic} disabled={verifying || !cnic.trim()}>
								{verifying ? 'Verifying...' : 'Verify CNIC (mock)'}
							</Button>
							{verifyResult ? (
								<div className="md:col-span-2 text-xs text-slate-600">Result: {verifyResult}</div>
							) : null}
						</div>

						<Table head={['User', 'CNIC', 'Status', 'Actions']} rows={rows} />
					</Section>
				</div>
			</div>
		</PageShell>
	);
}
