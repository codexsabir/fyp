'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { moneyPKR } from '@/lib/mockData';

export function PaymentModal({
	open,
	amount,
	bookingId,
	onClose,
	onPaid,
}: {
	open: boolean;
	amount: number;
	bookingId: string;
	onClose: () => void;
	onPaid: (payload: { transactionId: string; method: 'Easypaisa' | 'JazzCash' }) => void;
}) {
	const [method, setMethod] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
	const [loading, setLoading] = useState(false);
	if (!open) return null;

	async function pay() {
		setLoading(true);
		try {
			const res = await fetch('/api/payments', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ amount, method, bookingId }),
			});
			const data = await res.json();
			onPaid({ transactionId: data.item.transactionId, method });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
				<div className="flex items-center justify-between border-b p-4">
					<div>
						<div className="text-sm font-semibold text-slate-900">Mock Payment</div>
						<div className="text-xs text-slate-500">Complete payment to proceed</div>
					</div>
					<button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close">
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="p-4">
					<div className="rounded-xl bg-slate-50 p-4">
						<div className="text-xs text-slate-500">Amount</div>
						<div className="mt-1 text-2xl font-bold text-slate-900">PKR {moneyPKR(amount)}</div>
					</div>

					<div className="mt-4 grid grid-cols-2 gap-2">
						<button
							onClick={() => setMethod('Easypaisa')}
							className={`rounded-xl border p-3 text-sm font-semibold ${method === 'Easypaisa' ? 'border-emerald-500 bg-emerald-50' : 'hover:bg-slate-50'}`}
						>
							Easypaisa (mock)
						</button>
						<button
							onClick={() => setMethod('JazzCash')}
							className={`rounded-xl border p-3 text-sm font-semibold ${method === 'JazzCash' ? 'border-emerald-500 bg-emerald-50' : 'hover:bg-slate-50'}`}
						>
							JazzCash (mock)
						</button>
					</div>

					<button
						disabled={loading}
						onClick={pay}
						className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
					>
						{loading ? 'Processing...' : 'Pay now'}
					</button>

					<div className="mt-3 text-xs text-slate-500">No real payment is processed. This is UI-only.</div>
				</div>
			</div>
		</div>
	);
}
