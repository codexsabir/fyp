import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { moneyPKR, type MockProperty } from '@/lib/mockData';

export function PropertyCard({ property, role }: { property: MockProperty; role?: string }) {
	const r = role ?? 'tenant';
	return (
		<div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow">
			<img src={property.images?.[0]} alt={property.title} className="h-44 w-full object-cover" />
			<div className="p-4">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<div className="truncate text-base font-semibold text-slate-900">{property.title}</div>
						<div className="mt-1 inline-flex items-center gap-1 text-sm text-slate-600">
							<MapPin className="h-4 w-4" />
							<span className="truncate">{property.area}, {property.city}</span>
						</div>
					</div>
					<div className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
						PKR {moneyPKR(property.priceMonthly)}/mo
					</div>
				</div>

				<div className="mt-3 flex items-center justify-between">
					<div className="text-xs text-slate-500">
						{property.bedrooms} beds • {property.bathrooms} baths • {property.propertyType}
					</div>
					<Link
						href={`/property/${property.id}?role=${r}`}
						className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
					>
						View
					</Link>
				</div>
			</div>
		</div>
	);
}
