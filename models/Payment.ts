import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema(
	{
		bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
		amount: { type: Number, required: true },
		status: { type: String, enum: ['pending', 'success'], default: 'success' },
	},
	{ timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
