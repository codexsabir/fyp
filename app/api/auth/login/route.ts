import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const email = String(body?.email ?? '').trim().toLowerCase();
		const password = String(body?.password ?? '');

		if (!email || !password) {
			return NextResponse.json({ success: false, message: 'Missing email or password' }, { status: 400 });
		}

		await connectDB();

		const user = await UserModel.findOne({ email });
		if (!user) return NextResponse.json({ success: false, message: 'Invalid login' }, { status: 401 });

		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return NextResponse.json({ success: false, message: 'Invalid login' }, { status: 401 });

		const token = signToken({ userId: String(user._id), role: user.role });
		return NextResponse.json({
			success: true,
			token,
			user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
		});
	} catch (e: any) {
		return NextResponse.json({ success: false, message: e?.message ?? 'Login failed' }, { status: 500 });
	}
}
