import express from 'express';
import {
  getAllInstructors,
  getInstructorById,
  addInstructor,
  updateInstructor,
  deleteInstructor,
} from '../controllers/instructorController.js';
import auth from '../middleware/auth.js';
import permit from '../middleware/role.js';
import validate from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/', getAllInstructors);
router.get('/:id', getInstructorById);

const instructorValidation = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

router.post('/', auth, permit('admin'), instructorValidation, validate, addInstructor);
router.put('/:id', auth, permit('admin', 'instructor'), updateInstructor);
router.delete('/:id', auth, permit('admin'), deleteInstructor);

export default router;
