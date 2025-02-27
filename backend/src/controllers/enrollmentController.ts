import { Request, Response } from 'express';
import pool from '../utils/database';
import { Enrollment } from '../models/Enrollment';
import { sendNotification } from './notificationController';
import { sendEmail } from '../utils/emailService';

// Enroll a student in a course
export const enrollStudent = async (req: Request, res: Response) => {
    try {
        const { student_id, course_id } = req.body;

        if (!student_id || !course_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Check if student exists
        const [student]: any = await pool.execute(
            `SELECT id FROM users WHERE id = ? AND role = 'student'`,
            [student_id]
        );

        if (student.length === 0) {
            return res.status(404).json({ error: 'Student does not exist' });
        }

        // ✅ Check if course exists
        const [course]: any = await pool.execute(
            `SELECT id FROM courses WHERE id = ?`,
            [course_id]
        );

        if (course.length === 0) {
            return res.status(404).json({ error: 'Course does not exist' });
        }

        // ✅ Check if the student is already enrolled
        const [existingEnrollment]: any = await pool.execute(
            `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`,
            [student_id, course_id]
        );


        if (existingEnrollment.length > 0) {
            return res.status(400).json({ error: 'Student is already enrolled in this course' });
        }

        // ✅ Enroll the student
        await pool.execute(
            `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`,
            [student_id, course_id]
        );

        // ✅ Send Notification
        const message = `You have successfully enrolled in Course ID ${course_id}`;
        await sendNotification(student_id, message);

        // ✅ Send Email
        await sendEmail(student[0].email, 'Course Enrollment Successful', message);


        res.status(201).json({ message: 'Student enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};



export const getStudentEnrollments = async (req: Request, res: Response) => {
    try {
        const { student_id } = req.params;

        const [courses]: any = await pool.execute(
            `SELECT courses.* FROM courses 
         JOIN enrollments ON courses.id = enrollments.course_id 
         WHERE enrollments.student_id = ?`,
            [student_id]
        );

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


export const getCourseEnrollments = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params;

        const [students]: any = await pool.execute(
            `SELECT users.id, users.name, users.email FROM users 
         JOIN enrollments ON users.id = enrollments.student_id 
         WHERE enrollments.course_id = ?`,
            [course_id]
        );

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


export const unenrollStudent = async (req: Request, res: Response) => {
    try {
        const { student_id, course_id } = req.body;

        const [result]: any = await pool.execute(
            `DELETE FROM enrollments WHERE student_id = ? AND course_id = ?`,
            [student_id, course_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        res.json({ message: 'Student unenrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


