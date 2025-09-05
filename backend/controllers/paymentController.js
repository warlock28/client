import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import Course from '../models/Course.js';
import { sendPaymentConfirmationEmail } from '../utils/sendEmail.js'; // Placeholder for email logic

// Initiate a payment (e.g., Create Payment Intent for Stripe/Razorpay integration)
export const initiatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, appointmentId, paymentMethod } = req.body;

    if (!courseId || !appointmentId || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Fetch course to get amount
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Create payment record as pending
    const payment = await Payment.create({
      user: userId,
      course: courseId,
      appointment: appointmentId,
      amount: course.price,
      status: 'pending',
      paymentMethod,
    });

    // TODO: Integrate with Payment Gateway API here, e.g., create payment intent and return client secret/token
    // For now, simulate with placeholder response
    return res.json({
      success: true,
      message: 'Payment initiated. Proceed to payment gateway.',
      paymentId: payment._id,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      // clientSecret: paymentGatewayResponse.clientSecret, // example for Stripe
    });
  } catch (error) {
    console.error('Initiate Payment Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initiate payment.', error: error.message });
  }
};

// Update payment status after webhook/callback from payment gateway
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status, transactionId } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({ success: false, message: 'Payment ID and status are required.' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    // Update payment record
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    await payment.save();

    // If payment successful, update related appointment status to confirmed
    if (status === 'completed') {
      await Appointment.findByIdAndUpdate(payment.appointment, { status: 'confirmed' });
      
      // Send confirmation email asynchronously
      await sendPaymentConfirmationEmail(payment.user.email, payment.course, payment.amount);
    }

    return res.json({ success: true, message: 'Payment status updated.', payment });
  } catch (error) {
    console.error('Update Payment Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update payment status.', error: error.message });
  }
};

// Get payment details for current user
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('course', 'title price')
      .populate('appointment');
    return res.json({ success: true, payments });
  } catch (error) {
    console.error('Get User Payments Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get payments.', error: error.message });
  }
};

// Admin: Get all payments with filters
export const getAllPayments = async (req, res) => {
  try {
    // Admin check should be done via middleware
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('course', 'title price')
      .populate('appointment');
    return res.json({ success: true, payments });
  } catch (error) {
    console.error('Get All Payments Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payments.', error: error.message });
  }
};
