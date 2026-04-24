export type Role = 'admin' | 'landlord' | 'tenant';

export type MockUser = {
    id: string;
    name: string;
    email: string;
    role: Role;
    cnic: string;
    isVerified: boolean;
};

export type MockProperty = {
    id: string;
    title: string;
    description: string;
    priceMonthly: number;
    city: string;
    area: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    propertyType: 'House' | 'Apartment' | 'Portion' | 'Office';
    images: string[];
    landlordId: string;
    status: 'available' | 'pending' | 'rented';
    isVerified: boolean;
    createdAt: string;
};

export type MockBooking = {
    id: string;
    propertyId: string;
    tenantId: string;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    startDate: string;
    endDate: string;
    createdAt: string;
};

export type MockAgreement = {
    id: string;
    bookingId: string;
    propertyId: string;
    landlordId: string;
    tenantId: string;
    status: 'draft' | 'signed';
    signedAt?: string;
    content: string;
};

export type MockPayment = {
    id: string;
    bookingId: string;
    amount: number;
    method: 'Easypaisa' | 'JazzCash';
    status: 'success' | 'failed';
    transactionId: string;
    createdAt: string;
};

export type MockDocument = {
    id: string;
    ownerType: 'user' | 'property';
    ownerId: string;
    category: 'cnic_front' | 'cnic_back' | 'ownership' | 'utility_bill' | 'property_image' | 'other';
    name: string;
    url: string;
    verified: boolean;
    createdAt: string;
};

export const mockUsers: MockUser[] = [
    {
        id: 'u_admin_1',
        name: 'Admin RentP',
        email: 'admin@rentp.pk',
        role: 'admin',
        cnic: '3520212345671',
        isVerified: true,
    },
    {
        id: 'u_landlord_1',
        name: 'Sabir Khan',
        email: 'sabir.landlord@rentp.pk',
        role: 'landlord',
        cnic: '3740512345679',
        isVerified: true,
    },
    {
        id: 'u_tenant_1',
        name: 'Ayesha Ali',
        email: 'ayesha.tenant@rentp.pk',
        role: 'tenant',
        cnic: '4210112345670',
        isVerified: false,
    },
];

export const mockProperties: MockProperty[] = [
    {
        id: 'p_1',
        title: '3 Bed House in DHA Phase 6',
        description:
            'Well-maintained 3 bed house near commercial. Gas/Water available. Family preferred. Verification required.',
        priceMonthly: 160000,
        city: 'Lahore',
        area: 'DHA Phase 6',
        address: 'Street 8, Block C, DHA Phase 6, Lahore',
        bedrooms: 3,
        bathrooms: 3,
        propertyType: 'House',
        images: [
            'https://dummyimage.com/1200x800/e5e7eb/111827&text=RentP+Property+1',
            'https://dummyimage.com/1200x800/d1d5db/111827&text=Living+Room',
            'https://dummyimage.com/1200x800/cbd5e1/111827&text=Bedroom',
        ],
        landlordId: 'u_landlord_1',
        status: 'available',
        isVerified: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'p_2',
        title: '2 Bed Apartment in Bahria Town',
        description:
            'Secure building with elevator and parking. Close to school & market. Documents upload is mandatory (mock).',
        priceMonthly: 55000,
        city: 'Karachi',
        area: 'Bahria Town',
        address: 'Tower 4, Sector B, Bahria Town, Karachi',
        bedrooms: 2,
        bathrooms: 2,
        propertyType: 'Apartment',
        images: ['https://dummyimage.com/1200x800/e2e8f0/111827&text=RentP+Property+2'],
        landlordId: 'u_landlord_1',
        status: 'pending',
        isVerified: false,
        createdAt: new Date().toISOString(),
    },
];

export const mockBookings: MockBooking[] = [
    {
        id: 'b_1',
        propertyId: 'p_1',
        tenantId: 'u_tenant_1',
        status: 'pending',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
    },
];

export const mockAgreements: MockAgreement[] = [
    {
        id: 'a_1',
        bookingId: 'b_1',
        propertyId: 'p_1',
        landlordId: 'u_landlord_1',
        tenantId: 'u_tenant_1',
        status: 'draft',
        content: `RENTAL AGREEMENT (MOCK)\n\nThis Digital Rent Agreement is created between LANDLORD and TENANT for the Property.\n\n1) Term: 1 month (renewable)\n2) Rent: PKR 160,000 / month\n3) Security: 1 month rent\n4) Verification: CNIC + Property Docs (mock)\n5) Payment: Easypaisa/JazzCash (mock)\n\nBy clicking 'Sign Agreement' the tenant accepts these terms (mock).`,
    },
];

export const mockPayments: MockPayment[] = [
    {
        id: 'pay_1',
        bookingId: 'b_1',
        amount: 160000,
        method: 'Easypaisa',
        status: 'success',
        transactionId: 'TXN-RP-DEMO-001',
        createdAt: new Date().toISOString(),
    },
];

export const mockDocuments: MockDocument[] = [
    {
        id: 'd_1',
        ownerType: 'property',
        ownerId: 'p_1',
        category: 'ownership',
        name: 'Ownership Proof (Mock)',
        url: 'https://dummyimage.com/1200x800/f1f5f9/111827&text=Ownership+Document',
        verified: true,
        createdAt: new Date().toISOString(),
    },
];

export function moneyPKR(n: number) {
    return new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n);
}
