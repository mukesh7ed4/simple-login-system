import User from "../models/User.js";


export const sendFriendRequest = async (req, res) => {
  console.log(req.body,"sendfriendrequest")
  const { email } = req.body;

  try {
    const recipient = await User.findOne({ email });
    
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure that friendRequests and friends arrays exist
    if (!recipient.friendRequests) {
      recipient.friendRequests = []; // Initialize if it's undefined
    }

    if (!recipient.friends) {
      recipient.friends = []; // Initialize if it's undefined
    }

    if (recipient.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    if (recipient.friends.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already friends' });
    }

    // Add the friend request and save the recipient
    recipient.friendRequests.push(req.user._id);
    await recipient.save();

    res.status(200).json({ message: 'Friend request sent successfully', recipient });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Error sending friend request', error: error.message });
  }
};
