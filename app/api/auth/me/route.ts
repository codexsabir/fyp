import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { getAuthUser } from '@/app/api/auth/_auth';

export async function GET() {
	const auth = await getAuthUser();
	if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

	await connectDB();
	const user = await UserModel.findById(auth.userId).select('name email role').lean();
	if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

	return NextResponse.json({
		success: true,
		user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
	});
}
