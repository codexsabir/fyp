import { connectDB } from '@/lib/mongodb';
import UserModel from '@/models/User';
import { jsonError, jsonOk } from '@/app/api/_utils';
import { signJwt } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

type Body = { email: string; password: string };

export async function POST(req: Request) {
	try {
		await connectDB();
		const body = (await req.json()) as Partial<Body>;
		const email = String(body.email ?? '').trim().toLowerCase();
		const password = String(body.password ?? '');
		if (!email) return jsonError('Missing field: email', 400);
		if (!password) return jsonError('Missing field: password', 400);

		const user: any = await UserModel.findOne({ email }).lean();
		if (!user) return jsonError('Invalid credentials', 401);

		const ok = await bcrypt.compare(password, String(user.passwordHash ?? ''));
		if (!ok) return jsonError('Invalid credentials', 401);

		const token = signJwt({ id: String(user._id), email: user.email, role: user.role, name: user.name });
		return jsonOk({
			success: true,
			token,
			user: { id: String(user._id), name: user.name, email: user.email, role: user.role, verified: Boolean(user.verified) },
		});
	} catch (e: any) {
		return jsonError(e?.message ?? 'Bad Request', 400);
	}
}
