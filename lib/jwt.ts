import jwt from 'jsonwebtoken';

export type JwtPayload = {
	userId: string;
	role: 'tenant' | 'landlord' | 'admin';
};

function getSecret() {
	const s = process.env.JWT_SECRET;
	if (!s) throw new Error('Missing env: JWT_SECRET');
	return s;
}

export function signToken(payload: JwtPayload) {
	return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
	return jwt.verify(token, getSecret()) as JwtPayload;
}
