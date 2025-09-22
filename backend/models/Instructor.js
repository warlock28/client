import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '' },
  expertise: [{ type: String }],
  specializations: [{ type: String }], // Legal areas of focus
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  profileImage: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  experience: { type: String, default: '' }, // Years of experience
  education: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: String }
  }],
  certifications: [{ type: String }],
  hourlyRate: { type: Number, default: 0 },
  
  // Availability schedule
  availability: {
    monday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: { type: String }, // Format: "09:00"
        endTime: { type: String },   // Format: "17:00"
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    },
    tuesday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: { type: String },
        endTime: { type: String },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    },
    wednesday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: { type: String },
        endTime: { type: String },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    },
    thursday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: { type: String },
        endTime: { type: String },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    },
    friday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: { type: String },
        endTime: { type: String },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    },
    saturday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: { type: String },
        endTime: { type: String },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      slots: [{
        startTime: { type: String },
        endTime: { type: String },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    }
  },
  
  // Profile status
  isActive: { type: Boolean, default: true },
  isAvailableForBooking: { type: Boolean, default: true },
  totalBookings: { type: Number, default: 0 },
  completedSessions: { type: Number, default: 0 },
  
  // Contact and meeting preferences
  meetingPreference: { 
    type: String, 
    enum: ['online', 'in-person', 'both'], 
    default: 'online' 
  },
  onlineUrl: { type: String, default: '' }, // Zoom/Meet link
  officeAddress: { type: String, default: '' },
  
}, {
  timestamps: true,
});

export default mongoose.model('Instructor', instructorSchema);
