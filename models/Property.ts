import mongoose, { Schema } from 'mongoose';

export type PropertyStatus = 'available' | 'pending' | 'rented' | 'rejected';

const PropertySchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        priceMonthly: { type: Number, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
        address: { type: String, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        propertyType: { type: String, enum: ['House', 'Apartment', 'Portion', 'Office'], required: true },
        images: [{ type: String }],
        landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isVerified: { type: Boolean, default: false },
        status: { type: String, enum: ['available', 'pending', 'rented', 'rejected'], default: 'pending' },
        verificationNotes: { type: String },
    },
    { timestamps: true }
);

export const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
