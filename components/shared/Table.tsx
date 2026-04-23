import { ReactNode } from 'react';

export function Table({
	head,
	rows,
}: {
	head: string[];
	rows: Array<Array<ReactNode>>;
}) {
	return (
		<div className="overflow-hidden rounded-2xl border bg-white">
			<table className="w-full text-left text-sm">
				<thead className="bg-slate-50 text-xs font-semibold text-slate-600">
					<tr>
						{head.map((h) => (
							<th key={h} className="px-4 py-3">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((r, i) => (
						<tr key={i} className="border-t">
							{r.map((c, j) => (
								<td key={j} className="px-4 py-3 align-top">
									{c}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
