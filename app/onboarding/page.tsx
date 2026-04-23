'use client';

import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { Section } from '@/components/shared/Section';
import { Sidebar } from '@/components/layout/Sidebar';
import { CNICForm } from '@/components/shared/CNICForm';

export default function OnboardingPage() {
	const sp = useSearchParams();
	const role = (sp.get('role') as any) ?? 'tenant';

	return (
		<PageShell>
			<div className="grid gap-6 md:grid-cols-[260px_1fr]">
				<Sidebar
					title="Start"
					items={[
						{ href: '/', label: 'Home' },
						{ href: '/search', label: 'Search' },
						{ href: '/onboarding', label: 'CNIC onboarding' },
						{ href: '/admin/dashboard', label: 'Admin' },
						{ href: '/landlord/dashboard', label: 'Landlord' },
					]}
				/>
				<div>
					<Section title="Onboarding" description="Register (mock) and submit CNIC for admin verification.">
						<CNICForm defaultRole={role === 'landlord' ? 'landlord' : 'tenant'} />
					</Section>
				</div>
			</div>
		</PageShell>
	);
}
