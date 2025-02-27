import express from 'express';
const { createQuestion, getQuestionsByQuiz } =require('../controllers/questionController');

const router = express.Router();

router.post('/', createQuestion); // Create a new question
router.get('/:quiz_id', getQuestionsByQuiz); // Get all questions for a quiz

export default router;
