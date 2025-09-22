import User from '../models/user.js';
import Instructor from '../models/Instructor.js';
import Appointment from '../models/Appointment.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Instructor login (for admin panel access only)
export const instructorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with instructor role
    const user = await User.findOne({ 
      email, 
      role: 'instructor' 
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid instructor credentials'
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid instructor credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact administrator.'
      });
    }

    // Get instructor profile
    const instructorProfile = await Instructor.findOne({ user: user._id });
    if (!instructorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }

    // Generate token with instructor role
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: 'instructor',
        instructorId: instructorProfile._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      },
      instructorProfile,
      message: 'Instructor login successful'
    });

  } catch (error) {
    console.error('Instructor Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get instructor profile
export const getInstructorProfile = async (req, res) => {
  try {
    const instructorId = req.user.instructorId;
    
    const instructor = await Instructor.findById(instructorId)
      .populate('user', 'name email image')
      .populate('courses', 'title category price');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }

    // Format response
    const profileData = {
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
      courses: instructor.courses,
      address: instructor.address || { line1: '', line2: '' }
    };

    res.json({
      success: true,
      profileData
    });

  } catch (error) {
    console.error('Get Instructor Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update instructor profile (limited fields only)
export const updateInstructorProfile = async (req, res) => {
  try {
    const instructorId = req.user.instructorId;
    const { fees, about, available, address } = req.body;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }

    // Update allowed fields only
    if (fees !== undefined) instructor.fees = fees;
    if (about !== undefined) instructor.about = about;
    if (available !== undefined) instructor.available = available;
    if (address !== undefined) instructor.address = address;

    await instructor.save();

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update Instructor Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Get instructor dashboard data
export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.instructorId;

    // Get total consultations count
    const totalConsultations = await Appointment.countDocuments({
      instructorId: instructorId
    });

    // Get unique students count
    const uniqueStudents = await Appointment.distinct('userId', {
      instructorId: instructorId
    });

    // Get latest consultations
    const latestConsultations = await Appointment.find({
      instructorId: instructorId
    })
    .populate('userId', 'name image')
    .sort({ date: -1, time: -1 })
    .limit(10);

    const dashData = {
      consultations: totalConsultations,
      students: uniqueStudents.length,
      latestConsultations: latestConsultations.map(appointment => ({
        _id: appointment._id,
        userData: {
          name: appointment.userId.name,
          image: appointment.userId.image
        },
        slotDate: appointment.slotDate,
        slotTime: appointment.slotTime,
        cancelled: appointment.cancelled,
        isCompleted: appointment.isCompleted,
        amount: appointment.amount
      }))
    };

    res.json({
      success: true,
      dashData
    });

  } catch (error) {
    console.error('Get Instructor Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Get instructor consultations
export const getInstructorConsultations = async (req, res) => {
  try {
    const instructorId = req.user.instructorId;

    const consultations = await Appointment.find({
      instructorId: instructorId
    })
    .populate('userId', 'name image email')
    .populate('instructorId', 'name image')
    .sort({ date: -1, time: -1 });

    const formattedConsultations = consultations.map(appointment => ({
      _id: appointment._id,
      userData: {
        name: appointment.userId.name,
        image: appointment.userId.image,
        email: appointment.userId.email
      },
      instructorData: {
        name: appointment.instructorId.name,
        image: appointment.instructorId.image
      },
      slotDate: appointment.slotDate,
      slotTime: appointment.slotTime,
      cancelled: appointment.cancelled,
      isCompleted: appointment.isCompleted,
      amount: appointment.amount,
      payment: appointment.payment
    }));

    res.json({
      success: true,
      consultations: formattedConsultations
    });

  } catch (error) {
    console.error('Get Instructor Consultations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations',
      error: error.message
    });
  }
};

// Complete consultation
export const completeConsultation = async (req, res) => {
  try {
    const { consultationId } = req.body;
    const instructorId = req.user.instructorId;

    const consultation = await Appointment.findOne({
      _id: consultationId,
      instructorId: instructorId
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    if (consultation.cancelled) {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete a cancelled consultation'
      });
    }

    consultation.isCompleted = true;
    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation marked as completed'
    });

  } catch (error) {
    console.error('Complete Consultation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete consultation',
      error: error.message
    });
  }
};

// Cancel consultation
export const cancelConsultation = async (req, res) => {
  try {
    const { consultationId } = req.body;
    const instructorId = req.user.instructorId;

    const consultation = await Appointment.findOne({
      _id: consultationId,
      instructorId: instructorId
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    if (consultation.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed consultation'
      });
    }

    consultation.cancelled = true;
    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel Consultation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel consultation',
      error: error.message
    });
  }
};
