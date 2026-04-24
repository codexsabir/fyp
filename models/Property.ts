import mongoose, { Schema } from 'mongoose';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

const PropertySchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		city: { type: String, required: true, trim: true },
		priceMonthly: { type: Number, required: true },
		description: { type: String, required: true },
		images: [{ type: String }],
		ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
		rating: { type: Number },
		verificationCode: { type: String },
		verificationDocs: [{ type: String }],
	},
	{ timestamps: true }
);

const PropertyModel = (mongoose.models.Property as mongoose.Model<any>) || mongoose.model('Property', PropertySchema);
export default PropertyModel;
