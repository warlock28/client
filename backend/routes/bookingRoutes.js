import express from 'express';
import {
  getAvailableSlots,
  createBooking,
  getUserBookings,
  getInstructorBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingByConfirmation,
  addBookingFeedback
} from '../controllers/bookingController.js';
import auth from '../middleware/auth.js';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.get('/available-slots', getAvailableSlots);
router.get('/confirmation/:confirmationNumber', getBookingByConfirmation);

// Protected routes (require authentication)
router.use(auth);

// Booking validation rules
const createBookingValidation = [
  body('instructorId').notEmpty().withMessage('Instructor ID is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM format)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required (HH:MM format)'),
  body('sessionType').optional().isIn(['consultation', 'tutoring', 'exam-prep', 'career-guidance']),
  body('meetingType').optional().isIn(['online', 'in-person'])
];

const updateBookingValidation = [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).withMessage('Valid status is required')
];

const feedbackValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isLength({ max: 1000 }).withMessage('Feedback must be less than 1000 characters')
];

// User booking routes
router.post('/', createBookingValidation, validate, createBooking);
router.get('/user', getUserBookings);
router.put('/:bookingId/status', updateBookingValidation, validate, updateBookingStatus);
router.delete('/:bookingId', cancelBooking);
router.post('/:bookingId/feedback', feedbackValidation, validate, addBookingFeedback);

// Instructor booking routes
router.get('/instructor', getInstructorBookings);

export default router;
