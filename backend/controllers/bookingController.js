import Booking from '../models/Booking.js';
import Instructor from '../models/Instructor.js';
import User from '../models/user.js';
import { sendBookingConfirmationEmail, sendBookingUpdateEmail } from '../utils/sendEmail.js';

// Get available time slots for an instructor on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { instructorId, date } = req.query;
    
    if (!instructorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Instructor ID and date are required'
      });
    }

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    const bookingDate = new Date(date);
    const dayName = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Get instructor's availability for the day
    const dayAvailability = instructor.availability[dayName];
    if (!dayAvailability || !dayAvailability.available) {
      return res.json({
        success: true,
        availableSlots: [],
        message: 'Instructor is not available on this day'
      });
    }

    // Get existing bookings for this date
    const existingBookings = await Booking.find({
      instructor: instructorId,
      bookingDate: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lte: new Date(bookingDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate available slots
    const availableSlots = [];
    const bookedTimes = existingBookings.map(booking => `${booking.startTime}-${booking.endTime}`);

    dayAvailability.slots.forEach(slot => {
      const slotKey = `${slot.startTime}-${slot.endTime}`;
      if (!bookedTimes.includes(slotKey)) {
        availableSlots.push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          available: true
        });
      }
    });

    res.json({
      success: true,
      availableSlots,
      instructor: {
        name: instructor.user?.name,
        hourlyRate: instructor.hourlyRate
      }
    });

  } catch (error) {
    console.error('Get Available Slots Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available slots',
      error: error.message
    });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      instructorId,
      bookingDate,
      startTime,
      endTime,
      sessionType,
      subject,
      description,
      meetingType,
      userNotes
    } = req.body;

    // Validate required fields
    if (!instructorId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Instructor, date, start time, and end time are required'
      });
    }

    // Check if instructor exists
    const instructor = await Instructor.findById(instructorId).populate('user');
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    // Check if the time slot is still available
    const existingBooking = await Booking.findOne({
      instructor: instructorId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is no longer available'
      });
    }

    // Calculate duration and amount
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const duration = (end - start) / (1000 * 60); // Duration in minutes
    const amount = (duration / 60) * instructor.hourlyRate;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      instructor: instructorId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      duration,
      sessionType: sessionType || 'consultation',
      subject: subject || '',
      description: description || '',
      meetingType: meetingType || instructor.meetingPreference,
      amount,
      userNotes: userNotes || '',
      meetingUrl: meetingType === 'online' ? instructor.onlineUrl : '',
      meetingLocation: meetingType === 'in-person' ? instructor.officeAddress : ''
    });

    // Populate booking with user and instructor details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate({
        path: 'instructor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    // Update instructor's total bookings
    await Instructor.findByIdAndUpdate(instructorId, {
      $inc: { totalBookings: 1 }
    });

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(populatedBooking);
      await Booking.findByIdAndUpdate(booking._id, { emailSent: true });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    let query = { user: userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'instructor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: skip + bookings.length < totalBookings,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get User Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
};

// Get instructor's bookings
export const getInstructorBookings = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Instructors only.'
      });
    }

    // Find instructor profile
    const instructor = await Instructor.findOne({ user: req.user.id });
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }

    const { status, date, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { instructor: instructor._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (date) {
      const searchDate = new Date(date);
      query.bookingDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lte: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .sort({ bookingDate: 1, startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: skip + bookings.length < totalBookings,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get Instructor Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes, cancellationReason } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate({
        path: 'instructor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Authorization check
    const isInstructor = req.user.role === 'instructor' && 
                         booking.instructor.user._id.toString() === req.user.id;
    const isBookingOwner = booking.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isBookingOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Update booking
    booking.status = status;
    if (notes) {
      if (isInstructor) {
        booking.instructorNotes = notes;
      } else if (isBookingOwner) {
        booking.userNotes = notes;
      } else if (isAdmin) {
        booking.adminNotes = notes;
      }
    }
    
    if (status === 'cancelled' && cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    await booking.save();

    // Update instructor stats
    if (status === 'completed') {
      await Instructor.findByIdAndUpdate(booking.instructor._id, {
        $inc: { completedSessions: 1 }
      });
    }

    // Send update email
    try {
      await sendBookingUpdateEmail(booking, status);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });

  } catch (error) {
    console.error('Update Booking Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user can cancel
    const isBookingOwner = booking.user.toString() === req.user.id;
    const isInstructor = req.user.role === 'instructor';
    const isAdmin = req.user.role === 'admin';

    if (!isBookingOwner && !isInstructor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled (less than 24 hours before appointment or invalid status)'
      });
    }

    // Cancel the booking
    booking.status = 'cancelled';
    booking.cancellationReason = reason || '';
    await booking.save();

    // Send cancellation email
    try {
      await sendBookingUpdateEmail(booking, 'cancelled');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Get booking by confirmation number
export const getBookingByConfirmation = async (req, res) => {
  try {
    const { confirmationNumber } = req.params;

    const booking = await Booking.findOne({ confirmationNumber })
      .populate('user', 'name email phone')
      .populate({
        path: 'instructor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Get Booking by Confirmation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: error.message
    });
  }
};

// Add rating and feedback
export const addBookingFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, feedback } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only allow feedback after session is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for completed sessions'
      });
    }

    // Check authorization
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to provide feedback for this booking'
      });
    }

    // Update booking with feedback
    booking.userRating = rating;
    booking.userFeedback = feedback || '';
    await booking.save();

    // Update instructor's overall rating
    const instructor = await Instructor.findById(booking.instructor);
    const allRatings = await Booking.find({
      instructor: booking.instructor,
      userRating: { $exists: true, $ne: null }
    }).select('userRating');

    if (allRatings.length > 0) {
      const avgRating = allRatings.reduce((sum, b) => sum + b.userRating, 0) / allRatings.length;
      instructor.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
      instructor.totalReviews = allRatings.length;
      await instructor.save();
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      booking
    });

  } catch (error) {
    console.error('Add Booking Feedback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};
