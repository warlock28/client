import express from 'express';
import {
  getMyAppointments,
  getInstructorAppointments,
  getAllAppointments,
  updateAppointment,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import auth from '../middleware/auth.js';
import permit from '../middleware/role.js';

const router = express.Router();

router.get('/user', auth, permit('user'), getMyAppointments);
router.get('/instructor', auth, permit('instructor'), getInstructorAppointments);
router.get('/', auth, permit('admin'), getAllAppointments);
router.put('/:id', auth, updateAppointment);
router.delete('/:id', auth, cancelAppointment);

export default router;
