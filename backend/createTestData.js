import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.js';
import Instructor from './models/Instructor.js';
import Course from './models/Course.js';
import Appointment from './models/Appointment.js';
import Payment from './models/Payment.js';
import connectDB from './config/mongodb.js';
import 'dotenv/config';

const createTestData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Find the test instructor
    const instructorUser = await User.findOne({ email: 'instructor@test.com' });
    if (!instructorUser) {
      console.log('Test instructor not found. Please run testInstructorSetup.js first');
      process.exit(1);
    }

    const instructor = await Instructor.findOne({ user: instructorUser._id });
    const course = await Course.findOne({ instructor: instructor._id });

    if (!course) {
      console.log('Test course not found');
      process.exit(1);
    }

    // Create test students
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const existingStudent = await User.findOne({ email: `student${i}@test.com` });
      if (!existingStudent) {
        const hashedPassword = await bcrypt.hash('password123', 12);
        const student = await User.create({
          name: `Test Student ${i}`,
          email: `student${i}@test.com`,
          password: hashedPassword,
          role: 'user',
          phone: `+123456789${i}`
        });
        students.push(student);
        console.log(`Created student: ${student.email}`);
      } else {
        students.push(existingStudent);
        console.log(`Using existing student: ${existingStudent.email}`);
      }
    }

    // Create test appointments with different statuses
    const appointmentStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Check if appointment already exists
      const existingAppointment = await Appointment.findOne({
        user: student._id,
        course: course._id
      });
      
      if (!existingAppointment) {
        // Create appointment date (some past, some future)
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + (i - 2) * 7); // Mix of past and future dates
        
        const appointment = await Appointment.create({
          user: student._id,
          course: course._id,
          instructor: instructor._id,
          date: appointmentDate,
          status: appointmentStatuses[i % appointmentStatuses.length],
          notes: i === 2 ? 'Student showed excellent progress in logical reasoning.' : ''
        });

        console.log(`Created appointment for ${student.name} - Status: ${appointment.status}`);

        // Create payment record for completed appointments
        if (appointment.status === 'completed') {
          const payment = await Payment.create({
            user: student._id,
            course: course._id,
            amount: course.price,
            status: 'completed',
            appointment: appointment._id
          });
          console.log(`Created payment record for ${student.name}`);
        }

        // Update course enrollment count
        await Course.findByIdAndUpdate(course._id, {
          $inc: { studentsEnrolled: 1 }
        });

        // Add course to user's enrolled courses
        await User.findByIdAndUpdate(student._id, {
          $addToSet: { enrolledCourses: course._id }
        });
      } else {
        console.log(`Appointment already exists for ${student.name}`);
      }
    }

    console.log('✅ Test data creation completed successfully!');
    console.log('You can now test the instructor dashboard with:');
    console.log('Email: instructor@test.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();
