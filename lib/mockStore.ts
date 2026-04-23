import { mockAgreements, mockBookings, mockDocuments, mockPayments, mockProperties, mockUsers } from './mockData';

type Store = {
    users: typeof mockUsers;
    properties: typeof mockProperties;
    bookings: typeof mockBookings;
    agreements: typeof mockAgreements;
    payments: typeof mockPayments;
    documents: typeof mockDocuments;
};

declare global {
    // eslint-disable-next-line no-var
    var __rentpStore: Store | undefined;
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
    if (!global.__rentpStore) global.__rentpStore = initStore();
    return global.__rentpStore;
}
