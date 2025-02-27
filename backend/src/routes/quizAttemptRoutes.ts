import express from 'express';
const { submitQuiz }=require('../controllers/quizAttemptController');

const router = express.Router();

router.post('/submit', submitQuiz); // Submit a quiz attempt

export default router;
