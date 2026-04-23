'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Building2, LayoutDashboard, LogOut, Search, Shield, User2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
	{ key: 'tenant', label: 'Tenant', icon: User2 },
	{ key: 'landlord', label: 'Landlord/Agent', icon: Building2 },
	{ key: 'admin', label: 'Admin', icon: Shield },
] as const;

export function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const sp = useSearchParams();
	const role = (sp.get('role') ?? 'tenant') as 'tenant' | 'landlord' | 'admin';

	function setRole(nextRole: typeof role) {
		const params = new URLSearchParams(sp.toString());
		params.set('role', nextRole);
		router.push(`${pathname}?${params.toString()}`);
	}

	return (
		<header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link href={`/?role=${role}`} className="flex items-center gap-2 font-semibold text-slate-900">
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
						RP
					</span>
					<span>RentP</span>
				</Link>

				<nav className="hidden items-center gap-1 md:flex">
					<Link
						href={`/?role=${role}`}
						className={cn(
							'rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100',
							pathname === '/' && 'bg-slate-100 text-slate-900'
						)}
					>
						Home
					</Link>
					<Link
						href={`/search?role=${role}`}
						className={cn(
							'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100',
							pathname === '/search' && 'bg-slate-100 text-slate-900'
						)}
					>
						<Search className="h-4 w-4" />
						Browse
					</Link>
					<Link
						href={`/checkout?role=${role}`}
						className={cn(
							'rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100',
							pathname === '/checkout' && 'bg-slate-100 text-slate-900'
						)}
					>
						Checkout
					</Link>
				</nav>

				<div className="flex items-center gap-2">
					<div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 md:flex">
						{roles.map((r) => {
							const Icon = r.icon;
							const active = role === r.key;
							return (
								<button
									key={r.key}
									onClick={() => setRole(r.key)}
									className={cn(
										'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold',
										active ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
									)}
								>
									<Icon className="h-3.5 w-3.5" />
									{r.label}
								</button>
							);
						})}
					</div>

					<Link
						href={
							role === 'admin'
								? `/admin/dashboard?role=${role}`
								: role === 'landlord'
									? `/landlord/dashboard?role=${role}`
									: `/search?role=${role}`
						}
						className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
					>
						<LayoutDashboard className="h-4 w-4" />
						Portal
					</Link>

					<button
						onClick={() => router.push('/?role=tenant')}
						className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 md:inline-flex"
						aria-label="Reset to tenant role"
					>
						<LogOut className="h-4 w-4" />
						Reset
					</button>
				</div>
			</div>
		</header>
	);
}
