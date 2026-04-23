import mongoose, { Schema } from 'mongoose';

const BookingSchema = new Schema(
	{
		propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
		tenantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
	},
	{ timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
