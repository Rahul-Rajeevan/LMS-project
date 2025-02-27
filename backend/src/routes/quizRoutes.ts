import express from 'express';
const { createQuiz, getQuizzesByCourse } =require('../controllers/quizController');

const router = express.Router();

router.post('/', createQuiz); // Create a new quiz
router.get('/:course_id', getQuizzesByCourse); // Get all quizzes for a course

export default router;
