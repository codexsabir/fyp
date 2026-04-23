import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const cnic = String(body?.cnic ?? '');
    const normalized = cnic.replace(/\D/g, '');
    const verified = normalized.length === 13;
    return NextResponse.json({
        success: true,
        verified,
        message: verified ? 'CNIC verified (mock NADRA)' : 'Invalid CNIC format (mock)',
    });
}
