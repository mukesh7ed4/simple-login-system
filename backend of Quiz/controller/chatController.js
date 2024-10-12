import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name email')
      .sort('-updatedAt');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
};

export const createChat = async (req, res) => {
  const { participantId } = req.body;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] }
    });

    if (chat) {
      return res.json(chat);
    }

    chat = new Chat({
      participants: [req.user._id, participantId]
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { content } = req.body;
  const chatId = req.params.chatId;

  try {
    const newMessage = new Message({
      sender: req.user._id,
      content,
      chat: chatId
    });

    await newMessage.save();
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};