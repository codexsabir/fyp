'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export type SidebarItem = { href: string; label: string };

export function Sidebar({ title, items }: { title: string; items: SidebarItem[] }) {
	const pathname = usePathname();
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'tenant';

	return (
		<aside className="w-full rounded-xl border bg-white p-3 md:w-64">
			<div className="px-2 py-2 text-sm font-semibold text-slate-900">{title}</div>
			<nav className="mt-2 flex flex-col gap-1">
				{items.map((i) => {
					const active = pathname === i.href;
					const href = i.href.includes('?') ? `${i.href}&role=${role}` : `${i.href}?role=${role}`;
					return (
						<Link
							key={i.href}
							href={href}
							className={cn(
								'rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100',
								active && 'bg-slate-100 text-slate-900'
							)}
						>
							{i.label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
