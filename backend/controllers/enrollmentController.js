import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { sendEnrollmentEmail } from '../utils/sendEmail.js'; // Assume implemented

// User enrolls in a course and schedules appointment
export const createEnrollment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, appointmentDate } = req.body;

    // Validate input
    if (!courseId || !appointmentDate) {
      return res.status(400).json({ success: false, message: 'courseId and appointmentDate are required' });
    }

    // Check if course exists and active
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({ success: false, message: 'Course not found or inactive' });
    }

    // Check if user is already enrolled
    const existingAppointment = await Appointment.findOne({
      user: userId,
      course: courseId,
    });
    if (existingAppointment) {
      return res.status(409).json({ success: false, message: 'You have already enrolled in this course' });
    }

    // Check the appointmentDate is available in course's allowed slots (optional)
    // Here assuming course.slots is array of Date strings/Objects, implement logic accordingly
    // For simplicity, skipping slot validation; production needs this!

    // Create appointment
    const appointment = await Appointment.create({
      user: userId,
      course: courseId,
      instructor: course.instructor,
      date: new Date(appointmentDate),
      status: 'scheduled',
    });

    // Create payment record with pending status
    const payment = await Payment.create({
      user: userId,
      course: courseId,
      amount: course.price,
      status: 'pending',
      appointment: appointment._id,
    });

    // Append course to user's enrolled courses records
    await User.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } });

    // Send enrollment confirmation email asynchronously
    sendEnrollmentEmail(req.user.email, course.title, new Date(appointmentDate));

    return res.status(201).json({
      success: true,
      message: 'Enrollment successful. Please proceed with payment.',
      appointment,
      payment,
    });
  } catch (error) {
    console.error('Enrollment Error:', error);
    return res.status(500).json({ success: false, message: 'Enrollment failed', error: error.message });
  }
};

// Retrieve all enrollments for the user
export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Appointment.find({ user: req.user.id })
      .populate('course', 'title category price')
      .populate('instructor', 'name');
    return res.json({ success: true, enrollments });
  } catch (error) {
    console.error('User Enrollments Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch enrollments', error: error.message });
  }
};

// Retrieve all appointments for current instructor
export const getInstructorAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const appointments = await Appointment.find({ instructor: req.user.id })
      .populate('user', 'name email')
      .populate('course', 'title');
    return res.json({ success: true, appointments });
  } catch (error) {
    console.error('Instructor Appointments Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};

// Cancel or reschedule appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, newDate } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Authorization: user owns appointment or instructor assigned or admin
    if (
      appointment.user.toString() !== req.user.id &&
      appointment.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update appointment' });
    }

    if (status) appointment.status = status;
    if (newDate) appointment.date = new Date(newDate);

    await appointment.save();
    return res.json({ success: true, message: 'Appointment updated', appointment });
  } catch (error) {
    console.error('Update Appointment Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update appointment', error: error.message });
  }
};
