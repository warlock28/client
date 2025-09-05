import express from 'express';
import {
  initiatePayment,
  updatePaymentStatus,
  getUserPayments,
  getAllPayments,
} from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';
import permit from '../middleware/role.js';

const router = express.Router();

router.post('/initiate', auth, initiatePayment);
router.post('/update', auth, updatePaymentStatus);
router.get('/me', auth, getUserPayments);
router.get('/', auth, permit('admin'), getAllPayments);

export default router;
