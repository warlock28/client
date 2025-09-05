import { BookOpen, Clock, Users, Award, CheckCircle, Star } from 'lucide-react'

export const coursesData = [
  {
    id: 'lsat-prep',
    title: 'LSAT Preparation Course',
    subtitle: 'Master the Law School Admission Test',
    description: 'Comprehensive preparation for the LSAT with expert instructors from top law schools. Our proven methodology has helped thousands achieve their target scores.',
    longDescription: 'Our LSAT Preparation Course is designed to give you every advantage on test day. With over 120 hours of comprehensive instruction, you\'ll master every section of the LSAT through our proven teaching methodology. Our expert instructors, who scored in the 99th percentile, will guide you through logical reasoning, analytical reasoning (logic games), and reading comprehension with personalized attention and feedback.',
    price: 599,
    originalPrice: 799,
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    rating: 4.9,
    studentsEnrolled: 2847,
    image: 'lsat_course.jpg',
    category: 'LSAT',
    featured: true,
    highlights: [
      'Comprehensive coverage of all LSAT sections',
      '15+ full-length practice tests',
      'Expert tutors with 99th percentile scores',
      'Small class sizes (max 12 students)',
      'Personalized study plans',
      'Score improvement guarantee',
      'Flexible online and in-person options'
    ],
    curriculum: [
      {
        week: 1,
        title: 'LSAT Overview & Diagnostic',
        topics: ['Test structure', 'Timing strategies', 'Diagnostic assessment']
      },
      {
        week: 2,
        title: 'Logical Reasoning Fundamentals',
        topics: ['Argument structure', 'Question types', 'Common fallacies']
      },
      {
        week: 3,
        title: 'Logic Games Introduction',
        topics: ['Game types', 'Diagramming', 'Basic deductions']
      },
      {
        week: 4,
        title: 'Reading Comprehension',
        topics: ['Active reading', 'Question strategies', 'Time management']
      }
    ],
    instructor: {
      name: 'Prof. Sarah Mitchell',
      credentials: 'JD Harvard, LSAT 180',
      experience: '8 years teaching LSAT prep',
      image: 'instructor_sarah.jpg'
    }
  },
  {
    id: 'lnat-prep',
    title: 'LNAT Preparation Course',
    subtitle: 'Excel in the Law National Admissions Test',
    description: 'Specialized coaching for the LNAT with focus on critical thinking, essay writing, and multiple-choice mastery for UK law school admissions.',
    longDescription: 'The LNAT Preparation Course is specifically designed for students applying to top UK law schools. Our comprehensive program covers both sections of the test with intensive practice and personalized feedback. You\'ll develop critical thinking skills, master essay writing techniques, and learn to tackle complex multiple-choice questions efficiently.',
    price: 549,
    originalPrice: 699,
    duration: '10 weeks',
    level: 'Intermediate to Advanced',
    rating: 4.8,
    studentsEnrolled: 1923,
    image: 'lnat_course.jpg',
    category: 'LNAT',
    featured: true,
    highlights: [
      'Section A: Multiple choice mastery',
      'Section B: Essay writing excellence',
      'Critical thinking development',
      'UK law school admission guidance',
      'Mock exams with detailed feedback',
      'One-on-one mentoring sessions',
      'Application strategy support'
    ],
    curriculum: [
      {
        week: 1,
        title: 'LNAT Introduction & Strategy',
        topics: ['Test format', 'Scoring system', 'Time management']
      },
      {
        week: 2,
        title: 'Critical Thinking Skills',
        topics: ['Argument analysis', 'Logical reasoning', 'Assumption identification']
      },
      {
        week: 3,
        title: 'Essay Writing Techniques',
        topics: ['Structure and planning', 'Argumentation', 'Style and clarity']
      }
    ],
    instructor: {
      name: 'Dr. Michael Thompson',
      credentials: 'PhD Oxford, Former LNAT Examiner',
      experience: '10 years LNAT preparation',
      image: 'instructor_michael.jpg'
    }
  }
]

export default coursesData
