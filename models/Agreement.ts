import mongoose, { Schema } from 'mongoose';

const AgreementSchema = new Schema(
	{
		bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
		content: { type: String, required: true },
		signed: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const Agreement = mongoose.models.Agreement || mongoose.model('Agreement', AgreementSchema);
