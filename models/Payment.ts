import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
        amount: { type: Number, required: true },
        method: { type: String, enum: ['Easypaisa', 'JazzCash'], required: true },
        status: { type: String, enum: ['success', 'failed'], default: 'success' },
        transactionId: { type: String, required: true },
        rawResponse: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
