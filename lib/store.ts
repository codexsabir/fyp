import { mockAgreements, mockBookings, mockDocuments, mockPayments, mockProperties, mockUsers } from './mockData';

export type Store = {
	users: typeof mockUsers;
	properties: typeof mockProperties;
	bookings: typeof mockBookings;
	agreements: typeof mockAgreements;
	payments: typeof mockPayments;
	documents: typeof mockDocuments;
};

declare global {
	var __rentpInMemoryStore: Store | undefined;
}

function initStore(): Store {
	return {
		users: JSON.parse(JSON.stringify(mockUsers)),
		properties: JSON.parse(JSON.stringify(mockProperties)),
		bookings: JSON.parse(JSON.stringify(mockBookings)),
		agreements: JSON.parse(JSON.stringify(mockAgreements)),
		payments: JSON.parse(JSON.stringify(mockPayments)),
		documents: JSON.parse(JSON.stringify(mockDocuments)),
	};
}

export function getStore(): Store {
	if (!global.__rentpInMemoryStore) global.__rentpInMemoryStore = initStore();
	return global.__rentpInMemoryStore;
}
