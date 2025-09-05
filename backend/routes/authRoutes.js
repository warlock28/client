import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Registration validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name minimum 2 chars'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('image'), updateProfile);

export default router;
