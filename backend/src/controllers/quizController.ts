import { Request, Response } from 'express';
import pool from '../utils/database';

// ✅ Create a new quiz
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { course_id, title } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await pool.execute(
      `INSERT INTO quizzes (course_id, title) VALUES (?, ?)`,
      [course_id, title]
    );

    res.status(201).json({ message: 'Quiz created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// ✅ Get all quizzes for a course
export const getQuizzesByCourse = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.params;

    const [quizzes] = await pool.execute(
      `SELECT * FROM quizzes WHERE course_id = ?`,
      [course_id]
    );

    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
