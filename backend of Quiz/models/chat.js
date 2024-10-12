

import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
});

// Check if the model already exists before defining it
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;