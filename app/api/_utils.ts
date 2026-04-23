import { NextResponse } from 'next/server';

export function jsonOk(data: any, init?: ResponseInit) {
    return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400, extra?: Record<string, any>) {
    return NextResponse.json({ success: false, message, ...(extra ?? {}) }, { status });
}

export async function readJson<T>(req: Request): Promise<T> {
    try {
        return (await req.json()) as T;
    } catch {
        throw new Error('Invalid JSON body');
    }
}

export function requireString(v: any, field: string) {
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Missing field: ${field}`);
    return v.trim();
}

export function optionalString(v: any) {
    return typeof v === 'string' ? v.trim() : undefined;
}

export function requireNumber(v: any, field: string) {
    const n = Number(v);
    if (!Number.isFinite(n)) throw new Error(`Invalid number: ${field}`);
    return n;
}
