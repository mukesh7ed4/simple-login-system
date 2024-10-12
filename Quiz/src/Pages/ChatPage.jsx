import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client'; // Import Socket.IO client

const socket = io('http://localhost:5000'); // Connect to your backend

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', message); // Send message to the server
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
      <div className="overflow-y-auto mb-4" style={{ maxHeight: '300px' }}>
        {messages.map((msg, index) => (
          <div key={index} className="border p-2 mb-2">
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 flex-grow mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;


