import express from 'express';
const { enrollStudent, getStudentEnrollments, getCourseEnrollments, unenrollStudent } =require( '../controllers/enrollmentController');

const router = express.Router();

router.post('/enroll', enrollStudent); // Enroll a student in a course
router.get('/student/:student_id', getStudentEnrollments); // Get courses a student is enrolled in
router.get('/course/:course_id', getCourseEnrollments); // Get students enrolled in a course
router.delete('/unenroll', unenrollStudent); // Unenroll a student from a course

export default router;
