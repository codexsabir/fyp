import mongoose, { Schema } from 'mongoose';

export type PropertyStatus = 'pending' | 'approved' | 'rejected';

const PropertySchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		location: { type: String, required: true },
		images: [{ type: String }],
		landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
	},
	{ timestamps: true }
);

export const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
