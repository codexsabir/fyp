import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const PROTECTED = ['/landlord', '/chat', '/admin'];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (!PROTECTED.some((p) => pathname.startsWith(p))) return NextResponse.next();

	const token = req.cookies.get('rentp.token')?.value;
	if (!token) {
		const url = req.nextUrl.clone();
		url.pathname = '/login';
		return NextResponse.redirect(url);
	}

	try {
		const payload = verifyToken(token);
		if (pathname.startsWith('/admin') && payload.role !== 'admin') {
			const url = req.nextUrl.clone();
			url.pathname = '/';
			return NextResponse.redirect(url);
		}
		return NextResponse.next();
	} catch {
		const url = req.nextUrl.clone();
		url.pathname = '/login';
		return NextResponse.redirect(url);
	}
}

export const config = {
	matcher: ['/landlord/:path*', '/chat/:path*', '/admin/:path*'],
};
