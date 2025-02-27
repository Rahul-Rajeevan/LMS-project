import { Request, Response } from 'express';
import pool from '../utils/database';

// ✅ Function to send notifications
export const sendNotification = async (user_id: number, message: string) => {
  await pool.execute(
    `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
    [user_id, message]
  );
};

// ✅ Get Notifications for a User
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const [notifications] = await pool.execute(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// ✅ Mark Notification as Read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notification_id } = req.body;

    await pool.execute(
      `UPDATE notifications SET status = 'read' WHERE id = ?`,
      [notification_id]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
