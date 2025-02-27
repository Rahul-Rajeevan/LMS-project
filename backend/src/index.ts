import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import lessonRoutes from './routes/lessonRoutes';
import progressRoutes from './routes/progressRoutes';
import quizRoutes from './routes/quizRoutes';
import questionRoutes from './routes/questionRoutes';
import quizAttemptRoutes from './routes/quizAttemptRoutes';
import certificateRoutes from './routes/certificateRoutes';
import notificationRoutes from './routes/notificationRoutes';



dotenv.config();

const app = express();

// ✅ Middleware for JSON parsing
app.use(express.json()); // 👈 This is needed for parsing JSON
app.use(express.urlencoded({ extended: true })); // 👈 This is needed for form data

app.use(cors()); // ✅ Enable CORS

// ✅ Import Routes
import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz-attempts', quizAttemptRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);

app.use("/",(req, res) => {
  res.send("Welcome to the backend");
}
);


const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

