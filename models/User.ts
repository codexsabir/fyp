import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['admin', 'landlord', 'tenant'] },
  cnic: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);
