import express from 'express';
import {
  getDashboardStats,
  listUsers,
  listInstructors,
  listCourses,
  listAppointments,
  listPayments,
} from '../controllers/adminController.js';
import auth from '../middleware/auth.js';
import permit from '../middleware/role.js';

const router = express.Router();

router.use(auth);
router.use(permit('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', listUsers);
router.get('/instructors', listInstructors);
router.get('/courses', listCourses);
router.get('/appointments', listAppointments);
router.get('/payments', listPayments);

export default router;
