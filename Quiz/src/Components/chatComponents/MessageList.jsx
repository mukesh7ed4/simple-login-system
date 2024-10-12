// src/components/MessageList.js
import React from 'react';

const MessageList = ({ messages, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 ${
            msg.sender._id === currentUser._id ? 'text-right' : 'text-left'
          }`}
        >
          <span
            className={`inline-block p-2 rounded-lg ${
              msg.sender._id === currentUser._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300'
            }`}
          >
            {msg.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;