import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now() },
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
export default FriendRequest;
