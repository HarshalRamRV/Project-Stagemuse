import express from 'express';
import { verifyToken } from "../middleware/auth.js";
import { markMessagesAsRead, getMessagesBetweenUsers, getUnreadMessageCounts } from '../controllers/messages.js';

const router = express.Router();

// Define route to mark messages as read
router.put('/mark-read/:senderId/:receiverId', verifyToken, markMessagesAsRead);

// Define route to get messages between users
router.get('/:senderId/:receiverId', verifyToken, getMessagesBetweenUsers);

// Define route to get unread message counts for a user
router.get('/unread-counts/:userId', verifyToken, getUnreadMessageCounts);

export default router;
