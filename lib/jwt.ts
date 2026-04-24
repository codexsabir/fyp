// Minimal JWT-like token for demo purposes (HMAC-SHA256). Not for production.

import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'rentp-dev-secret';

function base64url(input: Buffer | string) {
    const buf = typeof input === 'string' ? Buffer.from(input) : input;
    return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlJson(obj: any) {
    return base64url(JSON.stringify(obj));
}

export function signJwt(payload: Record<string, any>, expSeconds = 60 * 60 * 24 * 7) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const full = { ...payload, iat: now, exp: now + expSeconds };
    const p1 = base64urlJson(header);
    const p2 = base64urlJson(full);
    const data = `${p1}.${p2}`;
    const sig = crypto.createHmac('sha256', SECRET).update(data).digest();
    return `${data}.${base64url(sig)}`;
}

export function verifyJwt(token: string): { valid: boolean; payload?: any; message?: string } {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return { valid: false, message: 'Malformed token' };
        const [p1, p2, p3] = parts;
        const data = `${p1}.${p2}`;
        const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64')
            .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        if (expected !== p3) return { valid: false, message: 'Bad signature' };
        const payload = JSON.parse(Buffer.from(p2.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
        const now = Math.floor(Date.now() / 1000);
        if (typeof payload.exp === 'number' && now > payload.exp) return { valid: false, message: 'Expired' };
        return { valid: true, payload };
    } catch (e: any) {
        return { valid: false, message: e?.message ?? 'Invalid token' };
    }
}
