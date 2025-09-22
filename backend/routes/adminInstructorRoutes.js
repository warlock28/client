import express from 'express';
import multer from 'multer';
import {
  addInstructor,
  getAllInstructors,
  changeInstructorAvailability,
  deleteInstructor,
  getAllAppointments,
  getAuditLogs,
  getAdminDashboard,
  adminLogin
} from '../controllers/adminInstructorController.js';
import auth from '../middleware/auth.js';
import permit from '../middleware/role.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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

// Admin authentication routes
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validateRequest, adminLogin);

// Admin-only routes (require admin authentication)
const adminAuth = [auth, permit('admin')];

// Dashboard
router.get('/dashboard', adminAuth, getAdminDashboard);

// Instructor management
router.post('/add-instructor', 
  adminAuth,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('bio').notEmpty().withMessage('Bio is required'),
    body('expertise').notEmpty().withMessage('Expertise is required'),
    body('experience').notEmpty().withMessage('Experience is required'),
    body('education').notEmpty().withMessage('Education is required'),
    body('fees').isNumeric().withMessage('Fees must be a number'),
    body('about').notEmpty().withMessage('About section is required')
  ],
  validateRequest,
  addInstructor
);

router.get('/all-instructors', adminAuth, getAllInstructors);

router.post('/change-instructor-availability',
  adminAuth,
  [
    body('instructorId').notEmpty().withMessage('Instructor ID is required')
  ],
  validateRequest,
  changeInstructorAvailability
);

router.delete('/delete-instructor/:instructorId', adminAuth, deleteInstructor);

// Appointments/Consultations management
router.get('/all-consultations', adminAuth, getAllAppointments);

// Audit logs
router.get('/audit-logs', adminAuth, getAuditLogs);

export default router;
