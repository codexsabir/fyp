import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken } from '@/lib/jwt';

const CNIC_RE = /^\d{5}-\d{7}-\d{1}$/;

export async function POST(req: Request) {
	try {
		const form = await req.formData();
		const role = String(form.get('role') ?? '');
		const name = String(form.get('name') ?? '').trim();
		const cnic = String(form.get('cnic') ?? '').trim();
		const email = String(form.get('email') ?? '').trim().toLowerCase();
		const password = String(form.get('password') ?? '');
		const cnicFront = form.get('cnicFront');
		const cnicBack = form.get('cnicBack');

		if (!['tenant', 'landlord'].includes(role)) {
			return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
		}
		if (!name || !email || !password || !cnic) {
			return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
		}
		if (!CNIC_RE.test(cnic)) {
			return NextResponse.json({ success: false, message: 'Invalid CNIC format. Use XXXXX-XXXXXXX-X' }, { status: 400 });
		}
		if (password.length < 4) {
			return NextResponse.json({ success: false, message: 'Password too short' }, { status: 400 });
		}
		if (!(cnicFront instanceof File) || !(cnicBack instanceof File)) {
			return NextResponse.json({ success: false, message: 'CNIC front/back images are required' }, { status: 400 });
		}

		await connectDB();

		const exists = await UserModel.findOne({ email }).lean();
		if (exists) return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 409 });

		// Save uploads to /uploads/cnic
		const fs = await import('node:fs/promises');
		const path = await import('node:path');

		const baseDir = path.join(process.cwd(), 'uploads', 'cnic');
		await fs.mkdir(baseDir, { recursive: true });

		async function saveFile(file: File) {
			const ext = (file.name.split('.').pop() || 'png').toLowerCase();
			const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
			const full = path.join(baseDir, filename);
			const buf = Buffer.from(await file.arrayBuffer());
			await fs.writeFile(full, buf);
			return `/uploads/cnic/${filename}`;
		}

		const frontPath = await saveFile(cnicFront);
		const backPath = await saveFile(cnicBack);

		const hashed = await bcrypt.hash(password, 10);
		const user = await UserModel.create({
			name,
			email,
			password: hashed,
			role,
			cnic,
			cnicFront: frontPath,
			cnicBack: backPath,
		});

		const token = signToken({ userId: String(user._id), role: user.role });

		return NextResponse.json({
			success: true,
			token,
			user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
		});
	} catch (e: any) {
		return NextResponse.json({ success: false, message: e?.message ?? 'Signup failed' }, { status: 500 });
	}
}
