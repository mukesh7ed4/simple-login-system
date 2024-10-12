// friendRoutes.js
import express from 'express';
import { sendFriendRequest } from '../controller/friendController.js';
import { protect } from '../middleware/authMiddleware.js';
import authenticateToken from '../middleware/authenticateToken.js';


const router = express.Router();

// router.post('/friends/request', authenticateToken, sendFriendRequest);

router.post('/requests', protect,sendFriendRequest);
// router.post('/accept', protect, acceptFriendRequest);
// router.get('/', protect, getFriends);

export default router;

