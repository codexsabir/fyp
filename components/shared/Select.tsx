import { cn } from '@/lib/utils';

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
	return <select {...props} className={cn('w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200', props.className)} />;
}
