'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { useUser } from '@/context/UserContext';

const CNIC_RE = /^\d{5}-\d{7}-\d{1}$/;

type Role = 'tenant' | 'landlord';

type Step = 1 | 2 | 3;

function RoleCard({
	role,
	selected,
	onClick,
	title,
	desc,
}: {
	role: Role;
	selected: boolean;
	onClick: () => void;
	title: string;
	desc: string;
}) {
	return (
		<button
			onClick={onClick}
			className={`rounded-2xl border p-5 text-left transition hover:shadow ${
				selected ? 'border-slate-900 bg-slate-50' : 'bg-white'
			}`}
		>
			<div className="text-sm font-semibold text-slate-900">{title}</div>
			<div className="mt-1 text-xs text-slate-600">{desc}</div>
			<div className="mt-3 text-xs font-semibold text-slate-700">Role: {role}</div>
		</button>
	);
}

export default function SignupPage() {
	const router = useRouter();
	const { setUser } = useUser();

	const [step, setStep] = useState<Step>(1);
	const [role, setRole] = useState<Role>('tenant');

	const [name, setName] = useState('');
	const [cnic, setCnic] = useState('');
	const [cnicFrontUrl, setCnicFrontUrl] = useState('');
	const [cnicBackUrl, setCnicBackUrl] = useState('');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');

	const cnicValid = useMemo(() => CNIC_RE.test(cnic), [cnic]);

	async function mockUpload(kind: 'front' | 'back') {
		const r = await fetch('/api/upload', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ category: kind === 'front' ? 'cnic_front' : 'cnic_back', name: `CNIC ${kind}` }),
		}).then((x) => x.json());
		if (kind === 'front') setCnicFrontUrl(r.url);
		else setCnicBackUrl(r.url);
	}

	async function submit() {
		setBusy(true);
		setError('');
		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					role,
					name,
					cnic,
					cnicFrontUrl,
					cnicBackUrl,
					email,
					password,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data?.message ?? 'Signup failed');
				return;
			}
			setUser({ ...data.user, token: data.token });
			router.push(role === 'landlord' ? '/dashboard' : '/');
		} finally {
			setBusy(false);
		}
	}

	return (
		<PageShell>
			<Section title="Create your account" description="Step-based signup with CNIC onboarding (mock uploads).">
				<div className="mx-auto max-w-xl rounded-2xl border bg-white p-5">
					<div className="text-xs font-semibold text-slate-500">Step {step} / 3</div>

					{step === 1 ? (
						<div className="mt-4 grid gap-3 sm:grid-cols-2">
							<RoleCard
								role="tenant"
								title="Tenant"
								desc="Find verified rentals and book safely."
								selected={role === 'tenant'}
								onClick={() => setRole('tenant')}
							/>
							<RoleCard
								role="landlord"
								title="Landlord"
								desc="List properties and manage inquiries."
								selected={role === 'landlord'}
								onClick={() => setRole('landlord')}
							/>
							<div className="sm:col-span-2">
								<Button className="w-full" onClick={() => setStep(2)}>
									Continue
								</Button>
							</div>
						</div>
					) : null}

					{step === 2 ? (
						<div className="mt-4 grid gap-3">
							<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
							<Input value={cnic} onChange={(e) => setCnic(e.target.value)} placeholder="35202-1234567-1" />
							<div className="grid gap-2 sm:grid-cols-2">
								<Button variant="secondary" onClick={() => mockUpload('front')}>
									{cnicFrontUrl ? 'CNIC front uploaded' : 'Mock upload CNIC front'}
								</Button>
								<Button variant="secondary" onClick={() => mockUpload('back')}>
									{cnicBackUrl ? 'CNIC back uploaded' : 'Mock upload CNIC back'}
								</Button>
							</div>
							<div className="flex gap-2">
								<Button variant="ghost" onClick={() => setStep(1)}>
									Back
								</Button>
								<Button className="flex-1" onClick={() => setStep(3)} disabled={!name.trim() || !cnicValid}>
									Continue
								</Button>
							</div>
							<div className="text-xs text-slate-500">CNIC format must be XXXXX-XXXXXXX-X</div>
						</div>
					) : null}

					{step === 3 ? (
						<div className="mt-4 grid gap-3">
							<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
							/>

							{error ? <div className="text-sm text-rose-600">{error}</div> : null}
							<div className="flex gap-2">
								<Button variant="ghost" onClick={() => setStep(2)}>
									Back
								</Button>
								<Button
									className="flex-1"
									onClick={submit}
									disabled={busy || !email.trim() || password.length < 4}
								>
									{busy ? 'Creating...' : 'Create account'}
								</Button>
							</div>
							<div className="text-xs text-slate-500">Password must be at least 4 characters.</div>
						</div>
					) : null}
				</div>
			</Section>
		</PageShell>
	);
}
