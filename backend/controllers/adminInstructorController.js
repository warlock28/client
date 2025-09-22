import User from '../models/user.js';
import Instructor from '../models/Instructor.js';
import Course from '../models/Course.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import AuditLog from '../models/AuditLog.js';

// Helper function to log admin actions
const logAdminAction = async (adminId, adminEmail, action, targetType, targetId, targetName, details, req = null) => {
  const logData = {
    adminId,
    adminEmail,
    action,
    targetType,
    targetId,
    targetName,
    details,
    ipAddress: req ? req.ip : null,
    userAgent: req ? req.get('User-Agent') : null,
    timestamp: new Date()
  };
  
  try {
    const savedLog = await AuditLog.create(logData);
    return savedLog;
  } catch (error) {
    console.error('Failed to save audit log:', error);
    return logData;
  }
};

// Add Instructor (Admin only)
export const addInstructor = async (req, res) => {
  try {
    const { 
      name, email, password, bio, expertise, experience, 
      education, fees, about, auditAction, auditDetails 
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    // Upload image to cloudinary
    let imageUrl = null;
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image"
      });
      imageUrl = imageUpload.secure_url;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User document with role 'instructor'
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'instructor',
      image: imageUrl
    });

    // Create Instructor document linked to User
    const instructor = await Instructor.create({
      user: user._id,
      bio,
      expertise,
      experience,
      education,
      fees: parseInt(fees),
      about,
      available: true,
      image: imageUrl
    });

    // Log admin action
    await logAdminAction(
      req.user.id,
      req.user.email,
      'CREATE_INSTRUCTOR',
      'INSTRUCTOR',
      instructor._id,
      name,
      `Created instructor ${name} with email ${email} and expertise ${expertise}`,
      req
    );

    res.status(201).json({ 
      success: true, 
      message: 'Instructor added successfully', 
      instructor 
    });

  } catch (error) {
    console.error('Add Instructor Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add instructor', 
      error: error.message 
    });
  }
};

// Get all instructors with user details (Admin only)
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find()
      .populate('user', 'name email image')
      .populate('courses', 'title category price');

    const formattedInstructors = instructors.map(instructor => ({
      _id: instructor._id,
      name: instructor.user.name,
      email: instructor.user.email,
      image: instructor.image || instructor.user.image,
      expertise: instructor.expertise,
      experience: instructor.experience,
      education: instructor.education,
      fees: instructor.fees,
      bio: instructor.bio,
      about: instructor.about,
      available: instructor.available,
      courses: instructor.courses
    }));

    res.json({ 
      success: true, 
      instructors: formattedInstructors 
    });

  } catch (error) {
    console.error('Get All Instructors Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch instructors', 
      error: error.message 
    });
  }
};

// Change instructor availability (Admin only)
export const changeInstructorAvailability = async (req, res) => {
  try {
    const { instructorId } = req.body;

    const instructor = await Instructor.findById(instructorId).populate('user', 'name');
    if (!instructor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Instructor not found' 
      });
    }

    instructor.available = !instructor.available;
    await instructor.save();

    // Log admin action
    await logAdminAction(
      req.user.id,
      req.user.email,
      'UPDATE_INSTRUCTOR',
      'INSTRUCTOR',
      instructor._id,
      instructor.user.name,
      `Changed availability status to ${instructor.available ? 'available' : 'unavailable'}`,
      req
    );

    res.json({ 
      success: true, 
      message: `Instructor ${instructor.available ? 'available' : 'unavailable'}` 
    });

  } catch (error) {
    console.error('Change Instructor Availability Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to change availability', 
      error: error.message 
    });
  }
};

// Delete instructor (Admin only)
export const deleteInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await Instructor.findById(instructorId).populate('user', 'name email');
    if (!instructor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Instructor not found' 
      });
    }

    // Check if instructor has any pending appointments
    const pendingAppointments = await Appointment.find({
      instructorId: instructor._id,
      isCompleted: false,
      cancelled: false
    });

    if (pendingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete instructor with pending appointments'
      });
    }

    const instructorName = instructor.user.name;
    const instructorEmail = instructor.user.email;

    // Remove linked User as well to keep clean data
    await User.findByIdAndDelete(instructor.user._id);

    // Remove instructor
    await Instructor.findByIdAndDelete(instructor._id);

    // Log admin action
    await logAdminAction(
      req.user.id,
      req.user.email,
      'DELETE_INSTRUCTOR',
      'INSTRUCTOR',
      instructor._id,
      instructorName,
      `Deleted instructor ${instructorName} (${instructorEmail})`,
      req
    );

    res.json({ 
      success: true, 
      message: 'Instructor deleted successfully' 
    });

  } catch (error) {
    console.error('Delete Instructor Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete instructor', 
      error: error.message 
    });
  }
};

// Get all appointments/consultations (Admin only)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name image')
      .populate('instructorId', 'name image fees')
      .sort({ date: -1 });

    res.json({ 
      success: true, 
      appointments 
    });

  } catch (error) {
    console.error('Get All Appointments Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch appointments', 
      error: error.message 
    });
  }
};

// Get audit logs (Admin only)
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;

    let query = {};
    if (action && action !== 'all') {
      query.action = action;
    }

    const auditLogs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const totalCount = await AuditLog.countDocuments(query);

    const formattedLogs = auditLogs.map(log => ({
      _id: log._id,
      adminName: log.adminEmail.split('@')[0], // Extract name from email
      adminEmail: log.adminEmail,
      action: log.action,
      targetType: log.targetType,
      targetName: log.targetName,
      details: log.details,
      timestamp: log.timestamp,
      ipAddress: log.ipAddress
    }));

    res.json({
      success: true,
      auditLogs: formattedLogs,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      message: 'Audit logs retrieved successfully'
    });

  } catch (error) {
    console.error('Get Audit Logs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
};

// Admin dashboard data
export const getAdminDashboard = async (req, res) => {
  try {
    const instructorsCount = await Instructor.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'user' });
    
    const recentAppointments = await Appointment.find()
      .populate('userId', 'name image')
      .populate('instructorId', 'name')
      .sort({ date: -1 })
      .limit(5);

    const dashData = {
      instructors: instructorsCount,
      appointments: appointmentsCount,
      students: studentsCount,
      recentAppointments
    };

    res.json({
      success: true,
      dashData
    });

  } catch (error) {
    console.error('Get Admin Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Admin login (separate from regular auth)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      
      const token = jwt.sign(
        { 
          email: process.env.ADMIN_EMAIL, 
          role: 'admin',
          isAdmin: true 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Log admin login
      await logAdminAction(
        'admin',
        process.env.ADMIN_EMAIL,
        'LOGIN',
        'SYSTEM',
        null,
        'Admin Panel',
        'Admin logged into system',
        req
      );

      res.json({
        success: true,
        token,
        message: 'Admin login successful'
      });

    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    });
  }
};
