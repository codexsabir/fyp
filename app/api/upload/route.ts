import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

function safeExt(name: string) {
	const ext = path.extname(name || '').toLowerCase();
	if (!ext) return '.bin';
	if (!/^\.[a-z0-9]{1,8}$/.test(ext)) return '.bin';
	return ext;
}

export async function POST(req: Request) {
	const form = await req.formData();
	const file = form.get('file');
	const category = String(form.get('category') ?? 'documents');
	const subdir = category.startsWith('cnic') ? 'cnic' : category.startsWith('property') ? 'properties' : 'documents';

	if (!(file instanceof File)) {
		return NextResponse.json({ success: false, message: 'file is required' }, { status: 400 });
	}

	const bytes = Buffer.from(await file.arrayBuffer());
	const ext = safeExt(file.name);
	const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
	const dir = path.join(process.cwd(), 'uploads', subdir);
	await mkdir(dir, { recursive: true });
	await writeFile(path.join(dir, fileName), bytes);

	const url = `/uploads/${subdir}/${fileName}`;
	return NextResponse.json({ success: true, url, path: url });
}
