import { cn } from '@/lib/utils';

export function Badge({
	children,
	variant = 'slate',
}: {
	children: React.ReactNode;
	variant?: 'slate' | 'emerald' | 'amber' | 'rose' | 'blue';
}) {
	const map: Record<string, string> = {
		slate: 'bg-slate-100 text-slate-700',
		emerald: 'bg-emerald-50 text-emerald-700',
		amber: 'bg-amber-50 text-amber-700',
		rose: 'bg-rose-50 text-rose-700',
		blue: 'bg-blue-50 text-blue-700',
	};
	return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', map[variant])}>{children}</span>;
}
