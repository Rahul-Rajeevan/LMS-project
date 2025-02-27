import { Request, Response } from 'express';
import pool from '../utils/database';
import { generateCertificate } from '../utils/certificateGenerator';
import { sendNotification } from './notificationController';
import { sendEmail } from '../utils/emailService';


// ✅ Issue a Certificate if Course is Completed
export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    

    // ✅ Check if the student has completed all lessons
    const [totalLessons]: any = await pool.execute(
      `SELECT COUNT(*) AS count FROM lessons WHERE course_id = ?`,
      [course_id]
    );

    const [completedLessons]: any = await pool.execute(
      `SELECT COUNT(*) AS count FROM progress WHERE student_id = ? AND course_id = ?`,
      [student_id, course_id]
    );

    if (completedLessons[0].count < totalLessons[0].count) {
      return res.status(400).json({ error: 'Complete all lessons before getting a certificate' });
    }

    // ✅ Check if the student has passed the final quiz (optional)
const [quizScore]: any = await pool.execute(
    `SELECT score FROM quiz_attempts WHERE student_id = ? AND quiz_id IN 
     (SELECT id FROM quizzes WHERE course_id = ?) ORDER BY attempted_at DESC LIMIT 1`,
    [student_id, course_id]
  );
  
  if (!quizScore.length || quizScore[0].score < 1) { // 👈 Check if this is set to 50
    return res.status(400).json({ error: 'Pass the final quiz to get the certificate' });
  }
  
    // ✅ Generate a Certificate
    const certificateUrl = await generateCertificate(student_id, course_id);

   // ✅ Fetch student email
   const [student]: any = await pool.execute(
    `SELECT email FROM users WHERE id = ?`,
    [student_id]
  );

  // ✅ Send Notification
  const message = `Congratulations! You have earned a certificate for Course ID ${course_id}. Download it here: ${certificateUrl}`;
  await sendNotification(student_id, message);

  // ✅ Send Email
  await sendEmail(student[0].email, 'Certificate Issued', message);

  res.status(201).json({ message: 'Certificate issued successfully', certificate_url: certificateUrl });
 } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// ✅ Get Certificate for a Student
export const getCertificate = async (req: Request, res: Response) => {
  try {
    const { student_id, course_id } = req.params;

    const [certificate]: any = await pool.execute(
      `SELECT * FROM certificates WHERE student_id = ? AND course_id = ?`,
      [student_id, course_id]
    );

    if (certificate.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
