import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getFeaturedCourses,
} from '../controllers/courseController.js';
import auth from '../middleware/auth.js';
import permit from '../middleware/role.js';
import validate from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourseById);

// Protected routes - Admin and Instructors
const courseValidation = [
  body('title').notEmpty(),
  body('category').isIn(['LSAT', 'LNAT']),
  body('price').isNumeric(),
];

router.post('/', auth, permit('admin', 'instructor'), courseValidation, validate, createCourse);
router.put('/:id', auth, permit('admin', 'instructor'), updateCourse);
router.delete('/:id', auth, permit('admin'), deleteCourse);

export default router;
