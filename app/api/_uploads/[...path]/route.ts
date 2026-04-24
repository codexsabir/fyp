import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const MIME: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.pdf': 'application/pdf',
};

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
	const params = await ctx.params;
	const parts = params.path || [];
	const rel = parts.join('/');
	const full = path.join(process.cwd(), 'uploads', rel);

	if (!full.startsWith(path.join(process.cwd(), 'uploads'))) {
		return NextResponse.json({ success: false, message: 'Invalid path' }, { status: 400 });
	}
	try {
		const buf = await readFile(full);
		const ext = path.extname(full).toLowerCase();
		return new NextResponse(buf, {
			headers: {
				'content-type': MIME[ext] ?? 'application/octet-stream',
				'cache-control': 'public, max-age=60',
			},
		});
	} catch {
		return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
	}
}
