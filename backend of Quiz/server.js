import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Add this import for CORS
import authRoutes from './routes/auth.js'; // Import your auth routes
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';
dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cookieParser()); // Enable cookie parsing

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173', // This should match your frontend origin
  credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Generate OTP
export const generateOTP = () => {
  return otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use authentication routes
app.use('/api/auth', authRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
