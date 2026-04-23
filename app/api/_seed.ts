import UserModel from '@/models/User';

export async function ensureSeedUsers() {
    const count = await UserModel.countDocuments();
    if (count > 0) return;

    await UserModel.create([
        {
            name: 'Admin RentP',
            email: 'admin@rentp.pk',
            role: 'admin',
            cnic: '3520212345671',
            isVerified: true,
        },
        {
            name: 'Sabir Khan',
            email: 'sabir.landlord@rentp.pk',
            role: 'landlord',
            cnic: '3740512345679',
            isVerified: true,
        },
        {
            name: 'Ayesha Ali',
            email: 'ayesha.tenant@rentp.pk',
            role: 'tenant',
            cnic: '4210112345670',
            isVerified: false,
        },
    ]);
}
