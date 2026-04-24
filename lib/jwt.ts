import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Missing env: JWT_SECRET');

export type JwtUser = {
	id: string;
	email: string;
	role: 'tenant' | 'landlord' | 'admin';
	name: string;
};

export function signJwt(payload: JwtUser) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): JwtUser {
	return jwt.verify(token, JWT_SECRET) as JwtUser;
}
