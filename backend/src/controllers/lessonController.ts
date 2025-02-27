import { Request, Response } from 'express';
import pool from '../utils/database';

// ✅ Create a new lesson
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { course_id, title, content, video_url } = req.body;

    if (!course_id || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await pool.execute(
      `INSERT INTO lessons (course_id, title, content, video_url) VALUES (?, ?, ?, ?)`,
      [course_id, title, content, video_url || null]
    );

    res.status(201).json({ message: 'Lesson created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// ✅ Get all lessons in a course
export const getLessonsByCourse = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.params;

    const [lessons] = await pool.execute(
      `SELECT * FROM lessons WHERE course_id = ?`,
      [course_id]
    );

    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
