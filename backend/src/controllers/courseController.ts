import { Request, Response } from 'express';
import pool from '../utils/database';
import { Course } from '../models/Course';
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, instructor_id, price } = req.body;
    if (!title || !description || !instructor_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO courses (title, description, instructor_id, price) VALUES (?, ?, ?, ?)`,
        [title, description, instructor_id, price || 0]
      );
      
      res.status(201).json({ message: 'Course created successfully', course_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


export const getCourses = async (_req: Request, res: Response) => {
    try {
      const [courses] = await pool.execute(`SELECT * FROM courses`);
      res.json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };



  export const getCourseById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Explicitly define the response type as RowDataPacket[]
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM courses WHERE id = ?`, 
        [id]
      );
  
      // Check if no courses are found
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.json(rows[0]); // Return the first course found
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  

  
  export const updateCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, price } = req.body;
  
      const [result] = await pool.execute(
        `UPDATE courses SET title = ?, description = ?, price = ? WHERE id = ?`,
        [title, description, price, id]
      );
  
      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.json({ message: 'Course updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };

  
  export const deleteCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const [result] = await pool.execute(`DELETE FROM courses WHERE id = ?`, [id]);
  
      if ((result as any).affectedRows === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };

  
