// socketHelpers.js
import Message from '../models/Message.js';
import User from '../models/User.js';

export const connectedUsers = new Map();

export const handleLogin = (io, socket, userId) => {
  connectedUsers.set(userId, socket.id);
  io.emit('userOnline', userId);
  console.log(`User ${userId} is online`);
};

export const handleLogout = (io, socket, userId) => {
  connectedUsers.delete(userId);
  io.emit('userOffline', userId);
  console.log(`User ${userId} is offline`);
};

export const handleSendMessage = async (io, socket, message) => {
  try {
    const newMessage = new Message(message);
    await newMessage.save();

    if (message.chat) {
      io.to(message.chat).emit('newMessage', newMessage);
    } else if (message.recipient) {
      const recipientSocket = connectedUsers.get(message.recipient);
      if (recipientSocket) {
        io.to(recipientSocket).emit('newMessage', newMessage);
      } else {
        console.log('Recipient not connected');
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const handleTyping = (io, socket, data) => {
  const recipientSocket = connectedUsers.get(data.recipient);
  if (recipientSocket) {
    io.to(recipientSocket).emit('typing', data.sender);
  }
};

export const handleFriendRequest = async (io, socket, data) => {
  try {
    const recipient = await User.findById(data.recipientId);
    if (recipient) {
      const senderSocket = connectedUsers.get(data.senderId);
      const recipientSocket = connectedUsers.get(data.recipientId);
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('newFriendRequest', { senderId: data.senderId });
      }
      
      if (senderSocket) {
        io.to(senderSocket).emit('friendRequestSent', { recipientId: data.recipientId });
      }
    }
  } catch (error) {
    console.error('Error handling friend request:', error);
  }
};