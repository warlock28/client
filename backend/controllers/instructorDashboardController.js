import Instructor from '../models/Instructor.js';
import Appointment from '../models/Appointment.js';
import Course from '../models/Course.js';
import User from '../models/user.js';
import Payment from '../models/Payment.js';

// Get instructor dashboard data
export const getInstructorDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied. Instructors only.' });
    }

    // Find instructor profile
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    // Get instructor's courses
    const courses = await Course.find({ instructor: instructor._id });
    const courseIds = courses.map(course => course._id);

    // Get appointments for instructor's courses
    const appointments = await Appointment.find({
      course: { $in: courseIds }
    })
      .populate('user', 'name email image')
      .populate('course', 'title category')
      .sort({ date: -1 })
      .limit(10);

    // Get total appointments count
    const totalAppointments = await Appointment.countDocuments({
      course: { $in: courseIds }
    });

    // Get appointments by status
    const appointmentStats = await Appointment.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get total course enrollments (unique users)
    const totalEnrollments = await Appointment.distinct('user', {
      course: { $in: courseIds }
    });

    // Get monthly enrollment stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEnrollments = await Appointment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get recent enrollments
    const recentEnrollments = await Appointment.find({
      course: { $in: courseIds }
    })
      .populate('user', 'name email image')
      .populate('course', 'title category')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total revenue (from completed payments)
    const revenue = await Payment.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment',
          foreignField: '_id',
          as: 'appointment'
        }
      },
      { $unwind: '$appointment' },
      {
        $match: {
          'appointment.course': { $in: courseIds },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const dashboardData = {
      instructor: {
        id: instructor._id,
        bio: instructor.bio,
        expertise: instructor.expertise,
        isActive: instructor.isActive
      },
      stats: {
        totalCourses: courses.length,
        totalAppointments,
        totalEnrollments: totalEnrollments.length,
        totalRevenue: revenue.length > 0 ? revenue[0].total : 0
      },
      appointmentStats: appointmentStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      courses,
      recentAppointments: appointments,
      recentEnrollments,
      monthlyEnrollments
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error('Instructor Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data', error: error.message });
  }
};

// Get all appointments for instructor
export const getInstructorAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied. Instructors only.' });
    }

    // Find instructor profile
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    // Get query parameters for filtering
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const courses = await Course.find({ instructor: instructor._id });
    const courseIds = courses.map(course => course._id);
    
    let query = { course: { $in: courseIds } };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get appointments with pagination
    const appointments = await Appointment.find(query)
      .populate('user', 'name email image phone')
      .populate('course', 'title category price')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalAppointments = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAppointments / limit),
        totalAppointments,
        hasNext: skip + appointments.length < totalAppointments,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get Instructor Appointments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};

// Get course enrollments for instructor
export const getInstructorEnrollments = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied. Instructors only.' });
    }

    // Find instructor profile
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    // Get query parameters
    const { courseId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get instructor's courses
    const courses = await Course.find({ instructor: instructor._id });
    let courseIds = courses.map(course => course._id);

    // Filter by specific course if provided
    if (courseId) {
      courseIds = courseIds.filter(id => id.toString() === courseId);
    }

    // Get enrollments (appointments) grouped by user
    const enrollments = await Appointment.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: {
            user: '$user',
            course: '$course'
          },
          userInfo: { $first: '$userInfo' },
          courseInfo: { $first: '$courseInfo' },
          appointments: { $push: '$$ROOT' },
          totalAppointments: { $sum: 1 },
          lastAppointment: { $max: '$date' },
          enrolledAt: { $min: '$createdAt' }
        }
      },
      { $sort: { enrolledAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);

    // Get total count
    const totalCount = await Appointment.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: {
            user: '$user',
            course: '$course'
          }
        }
      },
      { $count: 'total' }
    ]);

    const total = totalCount.length > 0 ? totalCount[0].total : 0;

    res.json({
      success: true,
      enrollments,
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEnrollments: total,
        hasNext: skip + enrollments.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get Instructor Enrollments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enrollments', error: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied. Instructors only.' });
    }

    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    // Find instructor profile
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    // Find appointment and verify it belongs to instructor's courses
    const appointment = await Appointment.findById(appointmentId)
      .populate('course');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check if appointment belongs to instructor
    if (appointment.course.instructor.toString() !== instructor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this appointment' });
    }

    // Update appointment
    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }
    await appointment.save();

    // Populate updated appointment
    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate('user', 'name email image')
      .populate('course', 'title category');

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update Appointment Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment', error: error.message });
  }
};

// Get instructor profile
export const getInstructorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied. Instructors only.' });
    }

    const instructor = await Instructor.findOne({ user: req.user.id })
      .populate('user', 'name email image phone')
      .populate('courses', 'title category price studentsEnrolled');

    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    res.json({ success: true, instructor });
  } catch (error) {
    console.error('Get Instructor Profile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

// Update instructor profile
export const updateInstructorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Access denied. Instructors only.' });
    }

    const { bio, expertise } = req.body;

    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    // Update instructor profile
    if (bio !== undefined) instructor.bio = bio;
    if (expertise !== undefined) instructor.expertise = expertise;
    
    await instructor.save();

    const updatedInstructor = await Instructor.findById(instructor._id)
      .populate('user', 'name email image phone')
      .populate('courses', 'title category price studentsEnrolled');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      instructor: updatedInstructor
    });
  } catch (error) {
    console.error('Update Instructor Profile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};
