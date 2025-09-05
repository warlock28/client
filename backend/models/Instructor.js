import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '' },
  expertise: [{ type: String }],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.model('Instructor', instructorSchema);
