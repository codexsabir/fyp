export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
	return (
		<section>
			<div className="mb-3">
				<div className="text-lg font-semibold text-slate-900">{title}</div>
				{description ? <div className="text-sm text-slate-600">{description}</div> : null}
			</div>
			{children}
		</section>
	);
}
