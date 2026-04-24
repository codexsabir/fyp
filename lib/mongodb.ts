import mongoose from 'mongoose';

declare global {
	// eslint-disable-next-line no-var
	var __mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Missing env: MONGODB_URI');

export async function connectDB() {
	if (!global.__mongoose) global.__mongoose = { conn: null, promise: null };
	if (global.__mongoose.conn) return global.__mongoose.conn;
	if (!global.__mongoose.promise) {
		global.__mongoose.promise = mongoose.connect(MONGODB_URI).then((m) => m);
	}
	global.__mongoose.conn = await global.__mongoose.promise;
	return global.__mongoose.conn;
}
