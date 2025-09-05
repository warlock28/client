import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Connect to Cloudinary for image uploads
connectCloudinary();

// CORS setup - allow list or all origins based on env var
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.length || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy denied this origin.'), false);
    }
  },
  credentials: true
}));

// Body parsers with size limits for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for uploaded images etc.)
app.use('/uploads', express.static('uploads'));

// API Routes registration
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check or welcome route
app.get('/', (req, res) => {
  res.send('LawEdu Backend API is running.');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'UnauthorizedError') {
    // JWT auth error
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed CORS origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : 'All origins allowed'}`);
});
