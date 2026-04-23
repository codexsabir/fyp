'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Section } from '@/components/shared/Section';
import { StatCard } from '@/components/shared/StatCard';

export default function AdminDashboard() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'admin';

	const [users, setUsers] = useState<any[]>([]);
	const [properties, setProperties] = useState<any[]>([]);
	const [payments, setPayments] = useState<any[]>([]);

	useEffect(() => {
		(async () => {
			const u = await fetch('/api/users').then((r) => r.json());
			setUsers(u.items ?? []);
			const p = await fetch('/api/properties').then((r) => r.json());
			setProperties(p.items ?? []);
			const pay = await fetch('/api/payments').then((r) => r.json());
			setPayments(pay.items ?? []);
		})();
	}, []);

	const pendingListings = useMemo(() => properties.filter((p) => p.status === 'pending').length, [properties]);
	const unverifiedUsers = useMemo(() => users.filter((u) => !u.isVerified).length, [users]);

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
					<Section title="Admin dashboard" description={`Role: ${role} (mock login)`}>
						<div className="grid gap-4 sm:grid-cols-3">
							<StatCard label="Total users" value={String(users.length)} accent="blue" />
							<StatCard label="Unverified users" value={String(unverifiedUsers)} accent="amber" />
							<StatCard label="Pending listings" value={String(pendingListings)} accent="rose" />
						</div>
					</Section>

					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						<div className="rounded-2xl border bg-white p-5">
							<div className="text-sm font-semibold text-slate-900">Transactions (mock)</div>
							<div className="mt-2 text-sm text-slate-600">Total payments recorded: {payments.length}</div>
							<div className="mt-4 text-xs text-slate-500">Payments are mock Easypaisa/JazzCash successes.</div>
						</div>
						<div className="rounded-2xl border bg-white p-5">
							<div className="text-sm font-semibold text-slate-900">Notifications (mock)</div>
							<div className="mt-2 text-sm text-slate-600">No real notifications in this build.</div>
							<div className="mt-4 text-xs text-slate-500">
								Simulate by approving listings/users from left menu.
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageShell>
	);
}
