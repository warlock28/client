import express from 'express';
import {
  getInstructorDashboard,
  getInstructorAppointments,
  getInstructorEnrollments,
  updateAppointmentStatus,
  getInstructorProfile,
  updateInstructorProfile
} from '../controllers/instructorDashboardController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and instructor role
router.use(auth);

// Dashboard routes
router.get('/dashboard', getInstructorDashboard);
router.get('/appointments', getInstructorAppointments);
router.get('/enrollments', getInstructorEnrollments);
router.get('/profile', getInstructorProfile);

// Update routes
router.put('/appointments/:appointmentId', updateAppointmentStatus);
router.put('/profile', updateInstructorProfile);

export default router;
