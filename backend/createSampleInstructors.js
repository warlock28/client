import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.js';
import Instructor from './models/Instructor.js';
import Course from './models/Course.js';
import connectDB from './config/mongodb.js';
import 'dotenv/config';

const sampleInstructors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@lawedu.com',
    bio: 'Dr. Sarah Johnson is a distinguished legal educator with over 15 years of experience in constitutional law and LSAT preparation. She holds a JD from Harvard Law School and has helped hundreds of students achieve their law school dreams.',
    specializations: ['Constitutional Law', 'LSAT Preparation', 'Legal Writing', 'Civil Rights'],
    expertise: ['LSAT Logical Reasoning', 'Constitutional Analysis', 'Legal Research Methods', 'Oral Advocacy'],
    experience: '15 years',
    education: [
      {
        degree: 'JD (Juris Doctor)',
        institution: 'Harvard Law School',
        year: '2008'
      },
      {
        degree: 'BA in Political Science',
        institution: 'Yale University',
        year: '2005'
      }
    ],
    certifications: ['LSAT Prep Certified', 'Constitutional Law Specialist', 'Legal Writing Expert'],
    hourlyRate: 200,
    rating: 4.9,
    totalReviews: 127,
    meetingPreference: 'both',
    onlineUrl: 'https://zoom.us/j/sarah-johnson-law',
    officeAddress: '123 Legal Plaza, Suite 450, New York, NY 10001',
    availability: {
      monday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '15:00', endTime: '16:00' },
          { startTime: '16:00', endTime: '17:00' }
        ]
      },
      tuesday: {
        available: true,
        slots: [
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '15:00', endTime: '16:00' }
        ]
      },
      wednesday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '13:00', endTime: '14:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '15:00', endTime: '16:00' }
        ]
      },
      thursday: {
        available: true,
        slots: [
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '15:00', endTime: '16:00' },
          { startTime: '16:00', endTime: '17:00' }
        ]
      },
      friday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '14:00', endTime: '15:00' }
        ]
      },
      saturday: { available: false, slots: [] },
      sunday: { available: false, slots: [] }
    }
  },
  {
    name: 'Prof. Michael Chen',
    email: 'michael.chen@lawedu.com',
    bio: 'Professor Michael Chen specializes in corporate law and LNAT preparation. With a background from Oxford and 12 years of teaching experience, he brings both theoretical knowledge and practical insights to help students excel.',
    specializations: ['Corporate Law', 'LNAT Preparation', 'Business Law', 'International Law'],
    expertise: ['LNAT Critical Thinking', 'Corporate Governance', 'Contract Analysis', 'International Business Law'],
    experience: '12 years',
    education: [
      {
        degree: 'BCL (Bachelor of Civil Law)',
        institution: 'Oxford University',
        year: '2011'
      },
      {
        degree: 'LLM in Corporate Law',
        institution: 'Cambridge University',
        year: '2012'
      }
    ],
    certifications: ['LNAT Prep Specialist', 'Corporate Law Expert', 'International Business Law Certified'],
    hourlyRate: 180,
    rating: 4.8,
    totalReviews: 89,
    meetingPreference: 'online',
    onlineUrl: 'https://meet.google.com/prof-michael-chen',
    officeAddress: '',
    availability: {
      monday: {
        available: true,
        slots: [
          { startTime: '08:00', endTime: '09:00' },
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '13:00', endTime: '14:00' },
          { startTime: '17:00', endTime: '18:00' }
        ]
      },
      tuesday: {
        available: true,
        slots: [
          { startTime: '08:00', endTime: '09:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '15:00', endTime: '16:00' },
          { startTime: '17:00', endTime: '18:00' }
        ]
      },
      wednesday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '16:00', endTime: '17:00' }
        ]
      },
      thursday: {
        available: true,
        slots: [
          { startTime: '08:00', endTime: '09:00' },
          { startTime: '13:00', endTime: '14:00' },
          { startTime: '15:00', endTime: '16:00' },
          { startTime: '17:00', endTime: '18:00' }
        ]
      },
      friday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '16:00', endTime: '17:00' }
        ]
      },
      saturday: {
        available: true,
        slots: [
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '11:00', endTime: '12:00' }
        ]
      },
      sunday: { available: false, slots: [] }
    }
  },
  {
    name: 'Ms. Emily Rodriguez',
    email: 'emily.rodriguez@lawedu.com',
    bio: 'Ms. Emily Rodriguez is a passionate educator specializing in criminal law and exam preparation strategies. With her JD from Stanford and 10 years of experience, she has a proven track record of helping students master complex legal concepts.',
    specializations: ['Criminal Law', 'Legal Ethics', 'Evidence Law', 'Bar Exam Preparation'],
    expertise: ['Criminal Procedure', 'Evidence Analysis', 'Legal Ethics', 'Exam Strategy', 'Case Study Analysis'],
    experience: '10 years',
    education: [
      {
        degree: 'JD (Juris Doctor)',
        institution: 'Stanford Law School',
        year: '2013'
      },
      {
        degree: 'MA in Criminology',
        institution: 'UC Berkeley',
        year: '2010'
      }
    ],
    certifications: ['Criminal Law Specialist', 'Bar Exam Prep Certified', 'Legal Ethics Expert'],
    hourlyRate: 160,
    rating: 4.7,
    totalReviews: 156,
    meetingPreference: 'both',
    onlineUrl: 'https://teams.microsoft.com/emily-rodriguez-law',
    officeAddress: '789 Justice Avenue, Floor 3, Los Angeles, CA 90028',
    availability: {
      monday: {
        available: true,
        slots: [
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '13:00', endTime: '14:00' },
          { startTime: '15:00', endTime: '16:00' },
          { startTime: '18:00', endTime: '19:00' }
        ]
      },
      tuesday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '12:00', endTime: '13:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '17:00', endTime: '18:00' }
        ]
      },
      wednesday: {
        available: true,
        slots: [
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '12:00', endTime: '13:00' },
          { startTime: '16:00', endTime: '17:00' },
          { startTime: '18:00', endTime: '19:00' }
        ]
      },
      thursday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '15:00', endTime: '16:00' },
          { startTime: '17:00', endTime: '18:00' }
        ]
      },
      friday: {
        available: true,
        slots: [
          { startTime: '12:00', endTime: '13:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '16:00', endTime: '17:00' }
        ]
      },
      saturday: {
        available: true,
        slots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:00', endTime: '11:00' },
          { startTime: '11:00', endTime: '12:00' }
        ]
      },
      sunday: {
        available: true,
        slots: [
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '15:00', endTime: '16:00' }
        ]
      }
    }
  }
];

const courses = [
  {
    instructorIndex: 0, // Dr. Sarah Johnson
    title: 'Advanced LSAT Preparation Bootcamp',
    category: 'LSAT',
    subtitle: 'Comprehensive LSAT prep with personalized strategies',
    description: 'Master all sections of the LSAT with expert guidance from Dr. Johnson',
    price: 25000,
    originalPrice: 30000,
    duration: '8 weeks',
    level: 'Advanced'
  },
  {
    instructorIndex: 1, // Prof. Michael Chen
    title: 'LNAT Success Masterclass',
    category: 'LNAT',
    subtitle: 'Complete LNAT preparation for UK law schools',
    description: 'Excel in the LNAT with Professor Chen\'s proven methodology',
    price: 22000,
    originalPrice: 27000,
    duration: '6 weeks',
    level: 'Beginner to Advanced'
  },
  {
    instructorIndex: 2, // Ms. Emily Rodriguez
    title: 'Criminal Law Fundamentals',
    category: 'LSAT',
    subtitle: 'Essential criminal law concepts and case analysis',
    description: 'Build strong foundations in criminal law with Ms. Rodriguez',
    price: 18000,
    originalPrice: 23000,
    duration: '10 weeks',
    level: 'Beginner'
  }
];

const createSampleInstructors = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Creating sample instructors...');

    const createdInstructors = [];
    const hashedPassword = await bcrypt.hash('instructor123', 12);

    for (let i = 0; i < sampleInstructors.length; i++) {
      const instructorData = sampleInstructors[i];
      
      // Check if instructor already exists
      const existingUser = await User.findOne({ email: instructorData.email });
      if (existingUser) {
        console.log(`Instructor ${instructorData.name} already exists`);
        const existingInstructor = await Instructor.findOne({ user: existingUser._id });
        createdInstructors.push(existingInstructor);
        continue;
      }

      // Create instructor user
      const instructorUser = await User.create({
        name: instructorData.name,
        email: instructorData.email,
        password: hashedPassword,
        role: 'instructor',
        phone: `+1-555-000${100 + i}`
      });

      console.log(`✅ Created user: ${instructorData.name}`);

      // Create instructor profile
      const instructorProfile = await Instructor.create({
        user: instructorUser._id,
        bio: instructorData.bio,
        specializations: instructorData.specializations,
        expertise: instructorData.expertise,
        experience: instructorData.experience,
        education: instructorData.education,
        certifications: instructorData.certifications,
        hourlyRate: instructorData.hourlyRate,
        rating: instructorData.rating,
        totalReviews: instructorData.totalReviews,
        meetingPreference: instructorData.meetingPreference,
        onlineUrl: instructorData.onlineUrl,
        officeAddress: instructorData.officeAddress,
        availability: instructorData.availability,
        isActive: true,
        isAvailableForBooking: true
      });

      console.log(`✅ Created instructor profile: ${instructorData.name}`);
      createdInstructors.push(instructorProfile);
    }

    // Create courses for instructors
    console.log('Creating courses for instructors...');
    
    for (const courseData of courses) {
      const instructor = createdInstructors[courseData.instructorIndex];
      
      // Check if course already exists
      const existingCourse = await Course.findOne({ 
        title: courseData.title,
        instructor: instructor._id 
      });
      
      if (existingCourse) {
        console.log(`Course "${courseData.title}" already exists`);
        continue;
      }

      const course = await Course.create({
        title: courseData.title,
        category: courseData.category,
        subtitle: courseData.subtitle,
        description: courseData.description,
        longDescription: courseData.description + ' This comprehensive course includes personalized attention, practice materials, and proven strategies.',
        price: courseData.price,
        originalPrice: courseData.originalPrice,
        duration: courseData.duration,
        level: courseData.level,
        rating: 4.5 + (Math.random() * 0.5),
        studentsEnrolled: Math.floor(Math.random() * 50) + 10,
        featured: Math.random() > 0.5,
        highlights: [
          'Expert instruction',
          'Personalized study plan',
          'Practice materials included',
          'Flexible scheduling',
          'Proven success strategies'
        ],
        curriculum: [
          {
            week: 1,
            title: 'Foundations and Assessment',
            topics: ['Initial Assessment', 'Core Concepts', 'Study Planning']
          },
          {
            week: 2,
            title: 'Advanced Techniques',
            topics: ['Strategic Approaches', 'Practice Problems', 'Time Management']
          }
        ],
        instructor: instructor._id,
        isActive: true
      });

      // Update instructor with course reference
      instructor.courses.push(course._id);
      await instructor.save();

      console.log(`✅ Created course: "${courseData.title}" for ${sampleInstructors[courseData.instructorIndex].name}`);
    }

    console.log('\n🎉 Sample instructors setup completed successfully!');
    console.log('\n📚 Created instructors:');
    sampleInstructors.forEach((instructor, index) => {
      console.log(`${index + 1}. ${instructor.name} (${instructor.email})`);
      console.log(`   Password: instructor123`);
      console.log(`   Specializations: ${instructor.specializations.join(', ')}`);
      console.log(`   Hourly Rate: ₹${instructor.hourlyRate}`);
      console.log(`   Rating: ${instructor.rating}/5.0 (${instructor.totalReviews} reviews)`);
      console.log('');
    });

    console.log('All instructors are available for booking with diverse time slots!');
    console.log('You can now test the comprehensive booking system.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample instructors:', error);
    process.exit(1);
  }
};

createSampleInstructors();
