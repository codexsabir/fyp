'use client';

import { useSearchParams } from 'next/navigation';

export function useRole() {
	const sp = useSearchParams();
	return (sp.get('role') ?? 'tenant') as 'admin' | 'landlord' | 'tenant';
}
