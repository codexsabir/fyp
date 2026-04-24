import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

export type UserRole = 'tenant' | 'landlord' | 'admin';

const UserSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ['tenant', 'landlord', 'admin'], required: true },
		cnic: { type: String, required: true, trim: true },
		cnicFront: { type: String, required: true },
		cnicBack: { type: String, required: true },
	},
	{ timestamps: true }
);

export type IUser = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const UserModel: Model<IUser> =
	(mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
