import { mockAgreements, mockBookings, mockDocuments, mockPayments, mockProperties, mockUsers } from './mockData';

export type Store = {
	users: typeof mockUsers;
	properties: typeof mockProperties;
	bookings: typeof mockBookings;
	agreements: typeof mockAgreements;
	payments: typeof mockPayments;
	documents: typeof mockDocuments;
	verifications: Array<{
		id: string;
		userId: string;
		cnic: string;
		frontUrl?: string;
		backUrl?: string;
		status: 'pending' | 'verified' | 'rejected';
		createdAt: string;
		updatedAt: string;
	}>;
	chats: Array<{
		id: string;
		propertyId?: string;
		participants: string[];
		messages: Array<{ id: string; senderId: string; text: string; createdAt: string }>;
		createdAt: string;
		updatedAt: string;
	}>;
};

declare global {
	var __rentpInMemoryStore: Store | undefined;
}

function initStore(): Store {
	const now = new Date().toISOString();
	return {
		users: JSON.parse(JSON.stringify(mockUsers)),
		properties: JSON.parse(JSON.stringify(mockProperties)),
		bookings: JSON.parse(JSON.stringify(mockBookings)),
		agreements: JSON.parse(JSON.stringify(mockAgreements)),
		payments: JSON.parse(JSON.stringify(mockPayments)),
		documents: JSON.parse(JSON.stringify(mockDocuments)),
		verifications: [
			{
				id: 'v_seed_1',
				userId: 'u_tenant_1',
				cnic: '42101-1234567-0',
				status: 'pending',
				createdAt: now,
				updatedAt: now,
			},
		],
		chats: [],
	};
}

export function getStore(): Store {
	if (!global.__rentpInMemoryStore) global.__rentpInMemoryStore = initStore();
	return global.__rentpInMemoryStore;
}
