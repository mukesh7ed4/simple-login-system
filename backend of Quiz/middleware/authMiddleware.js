import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;
console.log(req.headers.authorization)
  // Check for token in cookies
  if (req.headers.authorization) {
    token = req.headers.authorization; // Get the token from cookies
    token = token.replace(/^"|"$/g, '');
  }

  // Verify token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };

