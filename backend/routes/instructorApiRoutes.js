import express from 'express';
import {
  instructorLogin,
  getInstructorProfile,
  updateInstructorProfile,
  getInstructorDashboard,
  getInstructorConsultations,
  completeConsultation,
  cancelConsultation
} from '../controllers/instructorApiController.js';
import auth from '../middleware/auth.js';
import permit from '../middleware/role.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Instructor authentication
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validateRequest, instructorLogin);

// Instructor-only routes (require instructor authentication)
const instructorAuth = [auth, permit('instructor')];

// Profile management
router.get('/profile', instructorAuth, getInstructorProfile);

router.post('/update-profile',
  instructorAuth,
  [
    body('fees').optional().isNumeric().withMessage('Fees must be a number'),
    body('about').optional().isLength({ max: 1000 }).withMessage('About section too long'),
    body('available').optional().isBoolean().withMessage('Available must be boolean')
  ],
  validateRequest,
  updateInstructorProfile
);

// Dashboard
router.get('/dashboard', instructorAuth, getInstructorDashboard);

// Consultations management
router.get('/consultations', instructorAuth, getInstructorConsultations);

router.post('/complete-consultation',
  instructorAuth,
  [
    body('consultationId').notEmpty().withMessage('Consultation ID is required')
  ],
  validateRequest,
  completeConsultation
);

router.post('/cancel-consultation',
  instructorAuth,
  [
    body('consultationId').notEmpty().withMessage('Consultation ID is required')
  ],
  validateRequest,
  cancelConsultation
);

export default router;
