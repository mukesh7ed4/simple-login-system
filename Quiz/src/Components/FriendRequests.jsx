import React, { useState, useEffect } from 'react';

const FriendRequests = ({ onRequestAccepted }) => {
  const [friendRequests, setFriendRequests] = useState([]);

 

  const fetchFriendRequests = async (requestId) => {
    console.log("hii")
    try {
        console.log("hi")
      const response = await fetch('http://localhost:5000/api/friends/requests', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({email:requestId}),
      });
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data); // Ensure data matches your API response
      } else {
        console.error('Failed to fetch friend requests:', response.status);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/friends/accept/${requestId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        fetchFriendRequests(requestId);
        if (onRequestAccepted) onRequestAccepted();
      } else {
        console.error('Failed to accept friend request:', response.status);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
      {friendRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <ul>
          {friendRequests.map((request) => (
            <li key={request._id} className="mb-2 p-2 border rounded">
              <span>{request.sender.name} ({request.sender.email})</span>
              <button
                onClick={() => fetchFriendRequests(request._id)}
                className="ml-4 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
