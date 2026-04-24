import mongoose, { Schema } from 'mongoose';

export type UserRole = 'admin' | 'landlord' | 'tenant';

const UserSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true, unique: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['admin', 'landlord', 'tenant'], required: true },
		cnic: { type: String, required: true, trim: true },
		cnicFrontPath: { type: String },
		cnicBackPath: { type: String },
		verified: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const UserModel = (mongoose.models.User as mongoose.Model<any>) || mongoose.model('User', UserSchema);
export default UserModel;
