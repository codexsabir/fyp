import { connectDB } from '@/lib/mongodb';
import UserModel from '@/models/User';
import { jsonError, jsonOk } from '@/app/api/_utils';
import { signJwt } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

const CNIC_RE = /^\d{5}-\d{7}-\d{1}$/;

type Body = {
	role: 'tenant' | 'landlord';
	name: string;
	cnic: string;
	cnicFrontPath?: string;
	cnicBackPath?: string;
	email: string;
	password: string;
};

export const runtime = 'nodejs';

export async function POST(req: Request) {
	try {
		await connectDB();
		const body = (await req.json()) as Partial<Body>;

		const role = (body.role ?? 'tenant') as Body['role'];
		if (role !== 'tenant' && role !== 'landlord') return jsonError('Invalid role', 400);

		const name = String(body.name ?? '').trim();
		const email = String(body.email ?? '').trim().toLowerCase();
		const password = String(body.password ?? '');
		const cnic = String(body.cnic ?? '').trim();
		if (!name) return jsonError('Missing field: name', 400);
		if (!email) return jsonError('Missing field: email', 400);
		if (!password || password.length < 4) return jsonError('Password too short', 400);
		if (!CNIC_RE.test(cnic)) return jsonError('Invalid CNIC format. Use XXXXX-XXXXXXX-X', 400);

		const exists = await UserModel.findOne({ email }).lean();
		if (exists) return jsonError('Email already registered', 409);

		const passwordHash = await bcrypt.hash(password, 10);
		const user: any = await UserModel.create({
			name,
			email,
			passwordHash,
			role,
			cnic,
			cnicFrontPath: body.cnicFrontPath,
			cnicBackPath: body.cnicBackPath,
			verified: false,
		});

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
