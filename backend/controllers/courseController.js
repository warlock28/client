import Course from '../models/Course.js';
import Instructor from '../models/Instructor.js';
import { validationResult } from 'express-validator';

// Get all courses with optional filtering, pagination, and search
export const getAllCourses = async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category.toUpperCase();
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const courses = await Course.find(filter)
      .sort({ createdAt: -1, rating: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('instructor', 'name credentials');

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error('Get All Courses Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name credentials');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    console.error('Get Course By ID Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch course', error: error.message });
  }
};

// Create new course (Admin or Instructor only)
export const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const newCourse = await Course.create(req.body);

    if (req.user.role === 'instructor') {
      await Instructor.findOneAndUpdate(
        { user: req.user.id },
        { $push: { courses: newCourse._id } }
      );
    }

    res.status(201).json({ success: true, message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create course', error: error.message });
  }
};

// Update course details (Admin/Instructors)
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updateFields = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (req.user.role === 'instructor' && !course.instructor.equals(req.user.instructorId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    Object.assign(course, updateFields);
    await course.save();

    res.json({ success: true, message: 'Course updated', course });
  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update course', error: error.message });
  }
};

// Delete a course (Admin only)
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    await course.remove();
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete course', error: error.message });
  }
};

// Get featured courses
export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ featured: true, isActive: true })
      .sort({ rating: -1, studentsEnrolled: -1 })
      .limit(6)
      .populate('instructor', 'name');
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    console.error('Get Featured Courses Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured courses', error: error.message });
  }
};
