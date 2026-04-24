'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
	return (
		<Link
			href={href}
			className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 ${
				active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
			}`}
		>
			{children}
		</Link>
	);
}

export function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useAuth();
	const [open, setOpen] = useState(false);

	const links = useMemo(() => {
		const base = [
			{ href: '/', label: 'Home' },
			{ href: '/search', label: 'Properties' },
		];
		if (user?.role === 'landlord') base.push({ href: '/landlord/dashboard', label: 'Dashboard' });
		return base;
	}, [user?.role]);

	return (
		<header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">RP</span>
					<span>RentP</span>
				</Link>

				<nav className="hidden items-center gap-1 md:flex">
					{links.map((l) => (
						<NavLink key={l.href} href={l.href} active={pathname === l.href}>
							{l.label}
						</NavLink>
					))}
				</nav>

				<div className="flex items-center gap-2">
					{user ? (
						<>
							<div className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm md:flex" title={user.email}>
								<span className="max-w-[140px] truncate font-semibold text-slate-900">{user.name}</span>
								<span className="text-xs text-slate-600">{user.role}</span>
							</div>
							<button
								onClick={() => {
									logout();
									router.push('/login');
								}}
								className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
							>
								<LogOut className="h-4 w-4" />
								<span className="hidden sm:inline">Logout</span>
							</button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
								Login
							</Link>
							<Link href="/signup" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
								Sign up
							</Link>
						</div>
					)}

					<button
						onClick={() => setOpen((v) => !v)}
						className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100 md:hidden"
						aria-label="Menu"
					>
						<Menu className="h-5 w-5" />
					</button>
				</div>
			</div>

			{open ? (
				<div className="border-t bg-white md:hidden">
					<div className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								onClick={() => setOpen(false)}
								className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
							>
								{l.label}
							</Link>
						))}
						{user ? (
							<button
								onClick={() => {
									setOpen(false);
									logout();
									router.push('/login');
								}}
								className="text-left rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
							>
								Logout
							</button>
						) : (
							<>
								<Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Login</Link>
								<Link href="/signup" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Sign up</Link>
							</>
						)}
					</div>
				</div>
			) : null}
		</header>
	);
}
