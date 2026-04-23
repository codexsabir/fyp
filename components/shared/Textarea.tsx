import { cn } from '@/lib/utils';

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <textarea {...props} className={cn('w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200', props.className)} />;
}
