import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const ChatSchema = new Schema(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        messages: [MessageSchema],
    },
    { timestamps: true }
);

const ChatModel = (mongoose.models.Chat as mongoose.Model<any>) || mongoose.model('Chat', ChatSchema);
export default ChatModel;
