import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Core booking information
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Instructor', 
    required: true 
  },
  
  // Booking details
  bookingDate: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  }, // Format: "14:00"
  endTime: { 
    type: String, 
    required: true 
  }, // Format: "15:00"
  duration: { 
    type: Number, 
    default: 60 
  }, // Duration in minutes
  
  // Session information
  sessionType: {
    type: String,
    enum: ['consultation', 'tutoring', 'exam-prep', 'career-guidance'],
    default: 'consultation'
  },
  subject: { type: String, default: '' },
  description: { type: String, default: '' },
  
  // Meeting details
  meetingType: {
    type: String,
    enum: ['online', 'in-person'],
    required: true
  },
  meetingUrl: { type: String, default: '' }, // For online sessions
  meetingLocation: { type: String, default: '' }, // For in-person sessions
  
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  
  // Payment information
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: { type: String, default: '' },
  
  // Communication
  userNotes: { type: String, default: '' },
  instructorNotes: { type: String, default: '' },
  adminNotes: { type: String, default: '' },
  
  // Confirmation details
  confirmationNumber: { 
    type: String, 
    unique: true,
    default: () => `BK${Date.now()}${Math.floor(Math.random() * 1000)}`
  },
  confirmedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String, default: '' },
  
  // Email tracking
  emailSent: { type: Boolean, default: false },
  reminderSent: { type: Boolean, default: false },
  
  // Feedback and rating
  userRating: { type: Number, min: 1, max: 5 },
  userFeedback: { type: String, default: '' },
  instructorFeedback: { type: String, default: '' },
  
}, {
  timestamps: true,
});

// Indexes for better query performance
bookingSchema.index({ user: 1, bookingDate: 1 });
bookingSchema.index({ instructor: 1, bookingDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ confirmationNumber: 1 });

// Virtual for formatted booking time
bookingSchema.virtual('formattedTime').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Virtual for full booking date and time
bookingSchema.virtual('fullDateTime').get(function() {
  const date = this.bookingDate.toDateString();
  return `${date} from ${this.startTime} to ${this.endTime}`;
});

// Pre-save middleware to set confirmation details
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'confirmed' && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const bookingTime = new Date(this.bookingDate);
  const timeDiff = bookingTime - now;
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  // Can cancel if more than 24 hours before booking
  return hoursDiff > 24 && ['pending', 'confirmed'].includes(this.status);
};

// Method to check if booking is upcoming
bookingSchema.methods.isUpcoming = function() {
  const now = new Date();
  const bookingTime = new Date(this.bookingDate);
  return bookingTime > now && ['confirmed', 'pending'].includes(this.status);
};

export default mongoose.model('Booking', bookingSchema);
