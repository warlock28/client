import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['LSAT', 'LNAT'], required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  duration: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'], required: true },
  rating: { type: Number, default: 0 },
  studentsEnrolled: { type: Number, default: 0 },
  image: { type: String, default: null },
  featured: { type: Boolean, default: false },
  highlights: [{ type: String }],
  curriculum: [{
    week: { type: Number },
    title: { type: String },
    topics: [{ type: String }],
  }],
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

courseSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Course', courseSchema);
