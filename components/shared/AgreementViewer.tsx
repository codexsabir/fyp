'use client';

import { useState } from 'react';

export function AgreementViewer({
	content,
	onSign,
}: {
	content: string;
	onSign: (signature: string) => void;
}) {
	const [sig, setSig] = useState('');

	return (
		<div className="rounded-2xl border bg-white">
			<div className="border-b p-4">
				<div className="text-sm font-semibold text-slate-900">Digital Agreement (mock)</div>
				<div className="text-xs text-slate-500">Review and sign to continue</div>
			</div>
			<div className="max-h-80 overflow-auto p-4">
				<pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</pre>
			</div>
			<div className="border-t p-4">
				<label className="text-xs font-semibold text-slate-700">Type your name as signature (mock)</label>
				<input
					value={sig}
					onChange={(e) => setSig(e.target.value)}
					placeholder="e.g. Ayesha Ali"
					className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
				/>
				<button
					disabled={!sig.trim()}
					onClick={() => onSign(sig.trim())}
					className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
				>
					Sign agreement
				</button>
			</div>
		</div>
	);
}
