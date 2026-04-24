import { connectDB } from '@/lib/mongodb';
import UserModel from '@/models/User';
import { jsonError, jsonOk } from '@/app/api/_utils';
import { getAuthUser } from '@/app/api/auth/_auth';

export const runtime = 'nodejs';

export async function GET() {
	const auth = getAuthUser();
	if (!auth?.id) return jsonError('Unauthorized', 401);

	await connectDB();
	const user: any = await UserModel.findById(auth.id).lean();
	if (!user) return jsonError('Unauthorized', 401);

	return jsonOk({
		user: { id: String(user._id), name: user.name, email: user.email, role: user.role, verified: Boolean(user.verified) },
	});
}
