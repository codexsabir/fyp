import mongoose from 'mongoose';

declare global {
	// eslint-disable-next-line no-var
	var __mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

export async function connectDB() {
	if (!global.__mongoose) global.__mongoose = { conn: null, promise: null };
	if (global.__mongoose.conn) return global.__mongoose.conn;

	const uri = process.env.MONGODB_URI;
	if (!uri) throw new Error('Missing env: MONGODB_URI');

	if (!global.__mongoose.promise) {
		global.__mongoose.promise = mongoose.connect(uri).then((m) => m);
	}

	global.__mongoose.conn = await global.__mongoose.promise;
	return global.__mongoose.conn;
}
