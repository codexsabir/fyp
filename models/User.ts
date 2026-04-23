import mongoose, { Schema } from 'mongoose';

export type UserRole = 'admin' | 'landlord' | 'tenant';

const UserSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true, unique: true },
		role: { type: String, enum: ['admin', 'landlord', 'tenant'], required: true },
		cnic: { type: String, required: true, trim: true },
		isVerified: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default UserModel;
