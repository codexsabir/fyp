import mongoose from 'mongoose';

declare global {
    // eslint-disable-next-line no-var
    var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
    throw new Error('Missing env: MONGODB_URI');
}

export async function connectMongo() {
    if (!global.mongooseConn) {
        global.mongooseConn = { conn: null, promise: null };
    }

    if (global.mongooseConn.conn) return global.mongooseConn.conn;
    if (!global.mongooseConn.promise) {
        global.mongooseConn.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: MONGODB_DB_NAME || undefined,
            })
            .then((m) => m);
    }

    global.mongooseConn.conn = await global.mongooseConn.promise;
    return global.mongooseConn.conn;
}
