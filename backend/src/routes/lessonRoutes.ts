import express from 'express';
const { createLesson, getLessonsByCourse }=require('../controllers/lessonController');

const router = express.Router();

router.post('/', createLesson); // Create a new lesson
router.get('/:course_id', getLessonsByCourse); // Get all lessons in a course

export default router;
