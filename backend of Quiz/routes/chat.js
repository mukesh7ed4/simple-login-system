import express from 'express';
import { getChats, createChat, getMessages, sendMessage } from '../controller/chatController.js';

const router = express.Router();

router.get('/', getChats);
router.post('/', createChat);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);

export default router;