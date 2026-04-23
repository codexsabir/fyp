import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		type: { type: String, enum: ['cnic', 'property'], required: true },
		url: { type: String, required: true },
	},
	{ timestamps: true }
);

export const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
