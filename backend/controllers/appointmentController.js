import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Instructor from '../models/Instructor.js';

// User: Get own appointments (paginated)
export const getMyAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find({ user: req.user.id })
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('course', 'title category price')
      .populate('instructor', 'user name');

    const total = await Appointment.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      appointments,
    });
  } catch (error) {
    console.error('Get My Appointments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.', error: error.message });
  }
};

// Instructor: Get own appointments
export const getInstructorAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const appointments = await Appointment.find({ instructor: req.user.id })
      .sort({ date: -1 })
      .populate('user', 'name email')
      .populate('course', 'title');

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Get Instructor Appointments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.', error: error.message });
  }
};

// Admin: Get all appointments with filters
export const getAllAppointments = async (req, res) => {
  try {
    // Permissions checked in route middleware

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
      .populate('course', 'title')
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
    console.error('Get All Appointments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.', error: error.message });
  }
};

// Update appointment status or reschedule (user or instructor or admin)
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, newDate } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Authorization
    if (
      req.user.role !== 'admin' &&
      appointment.user.toString() !== req.user.id &&
      appointment.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this appointment.' });
    }

    if (status) appointment.status = status;
    if (newDate) appointment.date = new Date(newDate);

    await appointment.save();

    res.json({ success: true, message: 'Appointment updated.', appointment });
  } catch (error) {
    console.error('Update Appointment Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment.', error: error.message });
  }
};

// Cancel appointment (soft delete or status update)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });

    // Authorization check same as update
    if (
      req.user.role !== 'admin' &&
      appointment.user.toString() !== req.user.id &&
      appointment.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled.', appointment });
  } catch (error) {
    console.error('Cancel Appointment Error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel appointment.', error: error.message });
  }
};
