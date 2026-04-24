'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function LoginPage() {
	const router = useRouter();
	const { setUser } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data?.message ?? 'Login failed');

			setUser({ ...data.user, token: data.token });

			if (data.user?.role === 'landlord') router.push('/landlord/dashboard');
			else if (data.user?.role === 'admin') router.push('/admin/dashboard');
			else router.push('/');
		} catch (err: any) {
			setError(err?.message ?? 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mx-auto max-w-md px-4 py-10">
			<h1 className="text-2xl font-bold text-slate-900">Login</h1>
			<p className="mt-1 text-sm text-slate-600">Welcome back. Sign in to continue.</p>

			<form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
				<label className="block">
					<span className="text-sm font-medium text-slate-700">Email</span>
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						required
						className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
						placeholder="you@example.com"
					/>
				</label>
				<label className="block">
					<span className="text-sm font-medium text-slate-700">Password</span>
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						required
						className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
						placeholder="••••••••"
					/>
				</label>
				{error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
				>
					{loading ? 'Signing in…' : 'Login'}
				</button>
			</form>

			<p className="mt-4 text-sm text-slate-600">
				No account?{' '}
				<Link className="font-semibold text-slate-900 underline" href="/signup">
					Sign up
				</Link>
			</p>
		</div>
	);
}
