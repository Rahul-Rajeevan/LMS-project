import { Request, Response } from 'express';
import pool from '../utils/database';


// ✅ Submit Quiz Attempt
export const submitQuiz = async (req: Request, res: Response) => {
    try {
      const { student_id, quiz_id, answers } = req.body;
  
      if (!student_id || !quiz_id || !answers) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // ✅ Get correct answers
      const [questions]: any = await pool.execute(
        `SELECT id, correct_option FROM questions WHERE quiz_id = ?`,
        [quiz_id]
      );
  
      let score = 0;
  
      // ✅ Check answers
      for (const question of questions) {
        const userAnswer = answers[question.id]; // answers = { questionId: "A", questionId: "B" }
        if (userAnswer === question.correct_option) {
          score++;
        }
      }
  
      // ✅ Save quiz attempt
      await pool.execute(
        `INSERT INTO quiz_attempts (student_id, quiz_id, score) VALUES (?, ?, ?)`,
        [student_id, quiz_id, score]
      );
  
      res.json({ message: 'Quiz submitted successfully', score });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  