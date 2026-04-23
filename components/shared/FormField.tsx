import { cn } from '@/lib/utils';

export function FormField({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="text-xs font-semibold text-slate-700">{label}</div>
			{description ? <div className="mt-1 text-xs text-slate-500">{description}</div> : null}
			<div className={cn('mt-2')}>{children}</div>
		</div>
	);
}
