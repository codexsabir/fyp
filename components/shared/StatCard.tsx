import { cn } from '@/lib/utils';

export function StatCard({
	label,
	value,
	hint,
	accent = 'slate',
}: {
	label: string;
	value: string;
	hint?: string;
	accent?: 'slate' | 'emerald' | 'amber' | 'blue' | 'rose';
}) {
	const accentMap: Record<string, string> = {
		slate: 'border-slate-300',
		emerald: 'border-emerald-400',
		amber: 'border-amber-400',
		blue: 'border-blue-400',
		rose: 'border-rose-400',
	};
	return (
		<div className={cn('rounded-2xl border bg-white p-4', 'border-l-4', accentMap[accent])}>
			<div className="text-xs font-semibold text-slate-500">{label}</div>
			<div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
			{hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
		</div>
	);
}
