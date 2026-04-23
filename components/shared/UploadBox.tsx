'use client';

import { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UploadBox({ label, hint }: { label: string; hint?: string }) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [url, setUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onPick() {
		const file = inputRef.current?.files?.[0];
		if (!file) return;
		setLoading(true);
		try {
			const res = await fetch('/api/upload', { method: 'POST' });
			const data = await res.json();
			setUrl(data.url);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="rounded-xl border bg-white p-4">
			<div className="flex items-start justify-between gap-3">
				<div>
					<div className="text-sm font-semibold text-slate-900">{label}</div>
					{hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
				</div>
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
				>
					<CloudUpload className="h-4 w-4" />
					Choose
				</button>
			</div>

			<div className={cn('mt-3 rounded-lg border border-dashed p-4 text-sm text-slate-600', loading && 'opacity-60')}>
				<input ref={inputRef} onChange={onPick} type="file" className="hidden" />
				{loading ? 'Uploading (mock)...' : url ? `Uploaded (mock): ${url}` : 'No file selected (mock upload).'}
			</div>
		</div>
	);
}
