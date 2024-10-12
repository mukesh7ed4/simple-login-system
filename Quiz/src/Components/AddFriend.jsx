import React, { useState } from 'react';

import axios from 'axios';

const AddFriend = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error
    setSuccessMessage(''); // Clear any previous success message
console.log(localStorage)
    const token = localStorage.getItem('user'); // Assuming the token is stored in local storage

    if (!token) {
      setErrorMessage('No authentication token found. Please log in.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/friends/requests',
        { email , token},
        {
          headers: {
            Authorization: token, // Pass the token in the headers
          },
        }
      );

      // If successful, show the success message
      setSuccessMessage(response.data.message);
    } catch (error) {
      console.error('Error sending friend request:', error);

      // If the backend returns an error response
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Error sending friend request');
      } else {
        setErrorMessage('Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <div>
      <h2>Add Friend</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Friend Request</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AddFriend;

