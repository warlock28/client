import User from '../models/User.js';
import Instructor from '../models/Instructor.js';
import Course from '../models/Course.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';

// Get summary stats for dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const instructorsCount = await Instructor.countDocuments();
    const coursesCount = await Course.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const paymentsCount = await Payment.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      stats: {
        users: usersCount,
        instructors: instructorsCount,
        courses: coursesCount,
        appointments: appointmentsCount,
        payments: paymentsCount,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

// List all users (with pagination)
export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('-password');

    const total = await User.countDocuments();

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error('List Users Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

// List all instructors (with pagination)
export const listInstructors = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const instructors = await Instructor.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .select('-__v');

    const total = await Instructor.countDocuments();

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      instructors,
    });
  } catch (error) {
    console.error('List Instructors Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch instructors', error: error.message });
  }
};

// List all courses (with pagination)
export const listCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('instructor', 'user name');

    const total = await Course.countDocuments();

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      courses,
    });
  } catch (error) {
    console.error('List Courses Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

// List all appointments (with pagination and filtering options)
export const listAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, dateFrom, dateTo } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .populate('course', 'title price')
      .populate('instructor', 'user name');

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      appointments,
    });
  } catch (error) {
    console.error('List Appointments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};

// List all payments (with pagination)
export const listPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .populate('course', 'title price')
      .populate('appointment');

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    console.error('List Payments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
  }
};

// Additional admin functionalities like activating/suspending users, managing roles, etc. can be added here

