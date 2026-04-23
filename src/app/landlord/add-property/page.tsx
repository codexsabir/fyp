'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { Section } from '@/components/shared/Section';
import { FormField } from '@/components/shared/FormField';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Select } from '@/components/shared/Select';
import { UploadBox } from '@/components/shared/UploadBox';
import { Button } from '@/components/shared/Button';

export default function AddPropertyPage() {
	const sp = useSearchParams();
	const role = sp.get('role') ?? 'landlord';
	const router = useRouter();
	const landlordId = 'u_landlord_1';

	const [form, setForm] = useState({
		title: '',
		description: '',
		priceMonthly: 50000,
		city: 'Lahore',
		area: '',
		address: '',
		bedrooms: 2,
		bathrooms: 2,
		propertyType: 'Apartment',
	});
	const [images, setImages] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);

	async function submit() {
		setSubmitting(true);
		try {
			const res = await fetch('/api/properties', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...form, images, landlordId }),
			});
			const data = await res.json();
			router.push(`/landlord/listings?role=${role}&created=${data.item.id}`);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<PageShell>
			<div className="grid gap-6 md:grid-cols-[260px_1fr]">
				<Sidebar
					title="Landlord"
					items={[
						{ href: '/landlord/dashboard', label: 'Dashboard' },
						{ href: '/landlord/add-property', label: 'Add property' },
						{ href: '/landlord/listings', label: 'Listings' },
					]}
				/>
				<div>
					<Section title="Add property" description="Create a listing and upload documents (mock)">
						<div className="grid gap-4 rounded-2xl border bg-white p-5">
							<FormField label="Title">
								<Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. 3 Bed portion near market" />
							</FormField>
							<FormField label="Description">
								<Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Add key details..." />
							</FormField>
							<div className="grid gap-4 md:grid-cols-2">
								<FormField label="City">
									<Select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
										<option value="Lahore">Lahore</option>
										<option value="Karachi">Karachi</option>
										<option value="Islamabad">Islamabad</option>
									</Select>
								</FormField>
								<FormField label="Area">
									<Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. DHA Phase 6" />
								</FormField>
							</div>
							<FormField label="Address">
								<Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, block, etc." />
							</FormField>
							<div className="grid gap-4 md:grid-cols-3">
								<FormField label="Rent (PKR / month)">
									<Input type="number" value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: Number(e.target.value) })} />
								</FormField>
								<FormField label="Bedrooms">
									<Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} />
								</FormField>
								<FormField label="Bathrooms">
									<Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} />
								</FormField>
							</div>
							<FormField label="Property type">
								<Select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
									<option value="House">House</option>
									<option value="Apartment">Apartment</option>
									<option value="Portion">Portion</option>
									<option value="Office">Office</option>
								</Select>
							</FormField>

							<UploadBox
								label="Property images"
								hint="Mock upload returns a dummy URL. Click Choose to simulate."
							/>
							<div className="rounded-xl border bg-slate-50 p-4 text-xs text-slate-600">
								After you mock-upload, manually paste URLs into the listing by submitting again. (UI-first)
							</div>
							<UploadBox label="Ownership document" hint="Registry/Fard/Lease etc. (mock)" />
							<UploadBox label="Landlord CNIC" hint="CNIC front/back (mock)" />

							<Button className="w-full" onClick={submit} disabled={submitting || !form.title.trim()}>
								{submitting ? 'Submitting...' : 'Submit listing for verification'}
							</Button>
						</div>
					</Section>
				</div>
			</div>
		</PageShell>
	);
}
