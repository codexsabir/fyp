import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
		amount: { type: Number, required: true },
		method: { type: String, enum: ['JazzCash', 'Easypaisa'], required: true },
		status: { type: String, enum: ['completed', 'failed'], default: 'completed' },
		transactionId: { type: String, required: true },
	},
	{ timestamps: true }
);

const PaymentModel = (mongoose.models.Payment as mongoose.Model<any>) || mongoose.model('Payment', PaymentSchema);
export default PaymentModel;
