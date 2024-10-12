// socketHandler.js
import { connectedUsers, handleLogin, handleLogout, handleSendMessage, handleTyping, handleFriendRequest } from './socketHelpers.js';

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('login', (userId) => handleLogin(io, socket, userId));
    socket.on('logout', (userId) => handleLogout(io, socket, userId));
    socket.on('sendMessage', (message) => handleSendMessage(io, socket, message));
    socket.on('typing', (data) => handleTyping(io, socket, data));
    socket.on('friendRequest', (data) => handleFriendRequest(io, socket, data));

    socket.on('disconnect', () => {
      const userId = [...connectedUsers].find(([key, value]) => value === socket.id)?.[0];
      if (userId) {
        handleLogout(io, socket, userId);
      }
    });
  });
};