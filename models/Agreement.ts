import mongoose, { Schema } from 'mongoose';

const AgreementSchema = new Schema(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
        propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
        landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        tenantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['draft', 'signed'], default: 'draft' },
        content: { type: String, required: true },
        signedAt: { type: Date },
        meta: {
            tenantSignature: { type: String },
            landlordSignature: { type: String },
        },
    },
    { timestamps: true }
);

export const Agreement = mongoose.models.Agreement || mongoose.model('Agreement', AgreementSchema);
