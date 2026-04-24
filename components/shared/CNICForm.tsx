'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { UploadBox } from '@/components/shared/UploadBox';
import { Badge } from '@/components/shared/Badge';

const CNIC_RE = /^\d{5}-\d{7}-\d{1}$/;

export function CNICForm({
	defaultRole = 'tenant',
	onRegistered,
}: {
	defaultRole?: 'tenant' | 'landlord';
	onRegistered?: (user: any) => void;
}) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<'tenant' | 'landlord'>(defaultRole);
	const [cnic, setCnic] = useState('');
	const [frontUrl, setFrontUrl] = useState<string | undefined>();
	const [backUrl, setBackUrl] = useState<string | undefined>();
	const [submitting, setSubmitting] = useState(false);
	const [result, setResult] = useState<string>('');

	const valid = useMemo(() => CNIC_RE.test(cnic), [cnic]);

	async function submit() {
		setSubmitting(true);
		setResult('');
		try {
			const res = await fetch('/api/users/register', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, email, role, cnic, cnicFrontUrl: frontUrl, cnicBackUrl: backUrl }),
			});
			const data = await res.json();
			if (!res.ok) {
				setResult(data?.message ?? 'Registration failed');
				return;
			}
			setResult('Submitted. Status: pending_verification');
			onRegistered?.(data.item);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="rounded-2xl border bg-white p-5">
			<div className="flex items-start justify-between gap-3">
				<div>
					<div className="text-sm font-semibold text-slate-900">CNIC onboarding</div>
					<div className="mt-1 text-xs text-slate-500">Format: XXXXX-XXXXXXX-X</div>
				</div>
				<Badge variant={valid ? 'emerald' : 'amber'}>{valid ? 'VALID' : 'CHECK CNIC'}</Badge>
			</div>

			<div className="mt-4 grid gap-3">
				<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
				<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
				<Select
					value={role}
					onChange={(e) => setRole(e.target.value as any)}
					options={[
						{ label: 'Tenant', value: 'tenant' },
						{ label: 'Landlord', value: 'landlord' },
					]}
				/>
				<Input value={cnic} onChange={(e) => setCnic(e.target.value)} placeholder="35202-1234567-1" />

				<div className="grid gap-3 md:grid-cols-2">
					<div>
						<UploadBox label="CNIC front (mock upload)" hint="Click upload to create a dummy url" />
						<Button
							className="mt-2 w-full"
							variant="secondary"
							onClick={async () => {
								const r = await fetch('/api/upload', {
									method: 'POST',
									headers: { 'content-type': 'application/json' },
									body: JSON.stringify({ category: 'cnic_front', name: 'CNIC Front' }),
								}).then((x) => x.json());
								setFrontUrl(r.url);
							}}
						>
							{frontUrl ? 'Front uploaded' : 'Mock upload front'}
						</Button>
					</div>
					<div>
						<UploadBox label="CNIC back (mock upload)" hint="Click upload to create a dummy url" />
						<Button
							className="mt-2 w-full"
							variant="secondary"
							onClick={async () => {
								const r = await fetch('/api/upload', {
									method: 'POST',
									headers: { 'content-type': 'application/json' },
									body: JSON.stringify({ category: 'cnic_back', name: 'CNIC Back' }),
								}).then((x) => x.json());
								setBackUrl(r.url);
							}}
						>
							{backUrl ? 'Back uploaded' : 'Mock upload back'}
						</Button>
					</div>
				</div>

				<Button onClick={submit} disabled={submitting || !name.trim() || !email.trim() || !valid}>
					{submitting ? 'Submitting...' : 'Register & submit for verification'}
				</Button>

				{result ? <div className="text-xs text-slate-600">{result}</div> : null}
			</div>
		</div>
	);
}
