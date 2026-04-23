import { cn } from '@/lib/utils';

export function Button({
	children,
	variant = 'primary',
	className,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'ghost';
}) {
	const v =
		variant === 'primary'
			? 'bg-slate-900 text-white hover:bg-slate-800'
			: variant === 'secondary'
				? 'bg-white border hover:bg-slate-50 text-slate-900'
				: 'bg-transparent hover:bg-slate-100 text-slate-900';
	return (
		<button
			className={cn('inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60', v, className)}
			{...props}
		>
			{children}
		</button>
	);
}
