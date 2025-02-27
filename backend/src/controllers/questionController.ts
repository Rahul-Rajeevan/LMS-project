import { Request, Response } from 'express'; 
import pool from '../utils/database';


// ✅ Create a new question
export const createQuestion = async (req: Request, res: Response) => {
    try {
      const { quiz_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body;
  
      if (!quiz_id || !question || !option_a || !option_b || !option_c || !option_d || !correct_option) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      await pool.execute(
        `INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [quiz_id, question, option_a, option_b, option_c, option_d, correct_option]
      );
  
      res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
  // ✅ Get all questions for a quiz
  export const getQuestionsByQuiz = async (req: Request, res: Response) => {
    try {
      const { quiz_id } = req.params;
  
      const [questions] = await pool.execute(
        `SELECT * FROM questions WHERE quiz_id = ?`,
        [quiz_id]
      );
  
      res.json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  