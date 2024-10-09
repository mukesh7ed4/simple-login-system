import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); // State for managing error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup attempt with:', formData);
    setError(''); // Reset error message before submitting

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Signup successful:', data.message);
        // Handle successful signup (e.g., redirect or show a message)
      } else {
        setError(data.message); // Set error message from the response
        console.error('Signup failed:', data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An unexpected error occurred. Please try again.'); // Set a generic error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Name" 
              className="w-full p-2 border rounded" 
              required 
            />
          </div>
          <div className="mb-4">
            <input 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email" 
              className="w-full p-2 border rounded" 
              required 
            />
          </div>
          <div className="mb-6">
            <input 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Password" 
              className="w-full p-2 border rounded" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

