'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { UploadBox } from '@/components/shared/UploadBox';
import { Badge } from '@/components/shared/Badge';

const CNIC_RE = /^\d{5}-\d{7}-\d{1}$/;

type UploadResult = { success: boolean; url?: string; path?: string; message?: string };

export function CNICForm({
	defaultRole = 'tenant',
	onRegistered,
}: {
	defaultRole?: 'tenant' | 'landlord';
	onRegistered?: (user: any) => void;
}) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'tenant' | 'landlord'>(defaultRole);
	const [cnic, setCnic] = useState('');
	const [frontPath, setFrontPath] = useState<string>('');
	const [backPath, setBackPath] = useState<string>('');
	const [submitting, setSubmitting] = useState(false);
	const [result, setResult] = useState<string>('');

	const valid = useMemo(() => CNIC_RE.test(cnic), [cnic]);

	async function upload(file: File, category: 'cnic_front' | 'cnic_back'): Promise<UploadResult> {
		const fd = new FormData();
		fd.set('category', category);
		fd.set('file', file);
		const res = await fetch('/api/upload', { method: 'POST', body: fd });
		return (await res.json()) as UploadResult;
	}

	async function submit() {
		setSubmitting(true);
		setResult('');
		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name,
					email,
					password,
					role,
					cnic,
					cnicFrontPath: frontPath,
					cnicBackPath: backPath,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setResult(data?.message ?? 'Registration failed');
				return;
			}
			setResult('Account created');
			onRegistered?.(data.user);
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
				<Input value={cnic} onChange={(e) => setCnic(e.target.value)} placeholder="35202-1234567-1" />

				<div className="grid gap-3 md:grid-cols-2">
					<div>
						<UploadBox label="CNIC front" hint="Upload image" />
						<input
							type="file"
							accept="image/*"
							className="mt-2 block w-full text-xs"
							onChange={async (e) => {
								const f = e.target.files?.[0];
								if (!f) return;
								const r = await upload(f, 'cnic_front');
								if (r?.path) setFrontPath(r.path);
							}}
						/>
						<div className="mt-1 text-[11px] text-slate-500 truncate">{frontPath || 'No file selected'}</div>
					</div>
					<div>
						<UploadBox label="CNIC back" hint="Upload image" />
						<input
							type="file"
							accept="image/*"
							className="mt-2 block w-full text-xs"
							onChange={async (e) => {
								const f = e.target.files?.[0];
								if (!f) return;
								const r = await upload(f, 'cnic_back');
								if (r?.path) setBackPath(r.path);
							}}
						/>
						<div className="mt-1 text-[11px] text-slate-500 truncate">{backPath || 'No file selected'}</div>
					</div>
				</div>

				<Select
					value={role}
					onChange={(e) => setRole(e.target.value as any)}
					options={[
						{ label: 'Tenant', value: 'tenant' },
						{ label: 'Landlord', value: 'landlord' },
					]}
				/>

				<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
				<Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />

				<Button
					onClick={submit}
					disabled={
						submitting ||
						!name.trim() ||
						!email.trim() ||
						password.length < 4 ||
						!valid ||
						!frontPath ||
						!backPath
					}
				>
					{submitting ? 'Submitting...' : 'Create account'}
				</Button>

				{result ? <div className="text-xs text-slate-600">{result}</div> : null}
			</div>
		</div>
	);
}
