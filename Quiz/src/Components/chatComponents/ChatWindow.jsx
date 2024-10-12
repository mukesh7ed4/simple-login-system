// src/components/ChatWindow.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import AddFriend from '../AddFriend';
import io from 'socket.io-client';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      query: { userId: user._id }
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [user._id]);

  useEffect(() => {
    if (socket == null) return;

    socket.on('message', addMessage);
    socket.on('friendRequest', handleFriendRequest);
    socket.on('friendRequestAccepted', handleFriendRequestAccepted);

    return () => {
      socket.off('message');
      socket.off('friendRequest');
      socket.off('friendRequestAccepted');
    };
  }, [socket]);

  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleFriendRequest = useCallback(() => {
    // Update UI to show new friend request notification
    // You might want to add a state variable to track this
  }, []);

  const handleFriendRequestAccepted = useCallback(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/${chatId}/messages`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (currentChat && socket) {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${currentChat._id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          const message = await response.json();
          socket.emit('sendMessage', message);
          addMessage(message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const selectChat = (chat) => {
    setCurrentChat(chat);
    fetchMessages(chat._id);
    setShowAddFriend(false);
    setShowFriendRequests(false);
  };

  const toggleAddFriend = () => {
    setShowAddFriend(!showAddFriend);
    setShowFriendRequests(false);
    setCurrentChat(null);
  };

  const toggleFriendRequests = () => {
    setShowFriendRequests(!showFriendRequests);
    setShowAddFriend(false);
    setCurrentChat(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <button
          onClick={toggleAddFriend}
          className="w-full mb-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Friend
        </button>
        <button
          onClick={toggleFriendRequests}
          className="w-full mb-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Friend Requests
        </button>
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="cursor-pointer p-2 hover:bg-gray-200"
            onClick={() => selectChat(chat)}
          >
            {chat.participants.find(p => p._id !== user._id).name}
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        {showAddFriend ? (
          <AddFriend onFriendAdded={fetchChats} />
        ) : showFriendRequests ? (
          <FriendRequests onRequestAccepted={fetchChats} />
        ) : currentChat ? (
          <>
            <MessageList messages={messages} currentUser={user} />
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging, add a new friend, or check friend requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;