import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';

const router = express.Router();

router.get('/:user_id', getNotifications); // Get user notifications
router.put('/read', markAsRead); // Mark notification as read

export default router;
