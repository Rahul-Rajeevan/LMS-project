import express from 'express';
const { markLessonComplete, getCompletedLessons } =require('../controllers/progressController');

const router = express.Router();

router.post('/complete', markLessonComplete); // Mark lesson as completed
router.get('/:student_id/:course_id', getCompletedLessons); // Get completed lessons for a student

export default router;
