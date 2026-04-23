import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema(
    {
        ownerType: { type: String, enum: ['user', 'property'], required: true },
        ownerId: { type: Schema.Types.ObjectId, required: true },
        category: {
            type: String,
            enum: ['cnic_front', 'cnic_back', 'ownership', 'utility_bill', 'property_image', 'other'],
            required: true,
        },
        name: { type: String, required: true },
        url: { type: String, required: true },
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
