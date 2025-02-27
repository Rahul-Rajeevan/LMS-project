import express from 'express';
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } =require('../controllers/courseController');

const router = express.Router();

router.post('/', createCourse);       // Create a new course
router.get('/', getCourses);          // Get all courses
router.get('/:id', getCourseById);    // Get a single course
router.put('/:id', updateCourse);     // Update a course
router.delete('/:id', deleteCourse);  // Delete a course

export default router;
