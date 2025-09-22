import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.js';
import Instructor from './models/Instructor.js';
import Course from './models/Course.js';
import connectDB from './config/mongodb.js';
import 'dotenv/config';

const createTestInstructor = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if instructor already exists
    const existingUser = await User.findOne({ email: 'instructor@test.com' });
    if (existingUser) {
      console.log('Test instructor already exists');
      process.exit(0);
    }

    // Create instructor user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const instructorUser = await User.create({
      name: 'Test Instructor',
      email: 'instructor@test.com',
      password: hashedPassword,
      role: 'instructor',
      image: null,
      phone: '+1234567890'
    });

    console.log('Instructor user created:', instructorUser.email);

    // Create instructor profile
    const instructorProfile = await Instructor.create({
      user: instructorUser._id,
      bio: 'Experienced legal education instructor specializing in LSAT and LNAT preparation.',
      expertise: ['LSAT Preparation', 'LNAT Preparation', 'Legal Writing', 'Constitutional Law'],
      isActive: true
    });

    console.log('Instructor profile created:', instructorProfile._id);

    // Create a test course for the instructor
    const testCourse = await Course.create({
      title: 'LSAT Comprehensive Preparation Course',
      category: 'LSAT',
      subtitle: 'Complete preparation for LSAT success',
      description: 'A comprehensive course designed to help students excel in the LSAT examination with expert guidance and practice materials.',
      longDescription: 'This course provides in-depth preparation for all sections of the LSAT including Logical Reasoning, Reading Comprehension, and Analytical Reasoning. Students will receive personalized attention and strategic guidance.',
      price: 15000,
      originalPrice: 20000,
      duration: '12 weeks',
      level: 'Beginner to Advanced',
      rating: 4.8,
      studentsEnrolled: 0,
      featured: true,
      highlights: [
        'Comprehensive LSAT preparation',
        'Expert instruction',
        'Practice tests and feedback',
        'Personalized study plans',
        'Small class sizes'
      ],
      curriculum: [
        {
          week: 1,
          title: 'Introduction to LSAT',
          topics: ['LSAT Structure', 'Test Taking Strategies', 'Initial Assessment']
        },
        {
          week: 2,
          title: 'Logical Reasoning Basics',
          topics: ['Argument Structure', 'Common Question Types', 'Practice Problems']
        }
      ],
      instructor: instructorProfile._id,
      isActive: true
    });

    console.log('Test course created:', testCourse.title);

    // Update instructor with course reference
    instructorProfile.courses.push(testCourse._id);
    await instructorProfile.save();

    console.log('✅ Test instructor setup completed successfully!');
    console.log('Login credentials:');
    console.log('Email: instructor@test.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test instructor:', error);
    process.exit(1);
  }
};

createTestInstructor();
