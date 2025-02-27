import { Request, Response } from 'express';
import pool from '../utils/database';

export const markLessonComplete = async (req: Request, res: Response) => {
    try {
      const { student_id, course_id, lesson_id } = req.body;
  
      if (!student_id || !course_id || !lesson_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // ✅ Check if student is enrolled
      const [enrollment]: any = await pool.execute(
        `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`,
        [student_id, course_id]
      );
  
      if (enrollment.length === 0) {
        return res.status(400).json({ error: 'Student is not enrolled in this course' });
      }
  
      // ✅ Check if lesson exists
      const [lesson]: any = await pool.execute(
        `SELECT * FROM lessons WHERE id = ? AND course_id = ?`,
        [lesson_id, course_id]
      );
  
      if (lesson.length === 0) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
  
      // ✅ Mark lesson as completed
      await pool.execute(
        `INSERT INTO progress (student_id, course_id, lesson_id) VALUES (?, ?, ?)`,
        [student_id, course_id, lesson_id]
      );
  
      res.status(201).json({ message: 'Lesson marked as completed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
  // ✅ Get all completed lessons by a student
  export const getCompletedLessons = async (req: Request, res: Response) => {
    try {
      const { student_id, course_id } = req.params;
  
      const [completedLessons] = await pool.execute(
        `SELECT lessons.* FROM lessons 
         JOIN progress ON lessons.id = progress.lesson_id 
         WHERE progress.student_id = ? AND progress.course_id = ?`,
        [student_id, course_id]
      );
  
      res.json(completedLessons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  