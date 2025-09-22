import Instructor from '../models/Instructor.js';
import User from '../models/user.js';
import Course from '../models/Course.js';

// Get all instructors (public)
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find()
      .populate('user', 'name email image')
      .populate('courses', 'title category price');
    res.json({ success: true, instructors });
  } catch (error) {
    console.error('Get All Instructors Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch instructors', error: error.message });
  }
};

// Get single instructor details (public)
export const getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id)
      .populate('user', 'name email image bio')
      .populate('courses', 'title category price');
    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });
    res.json({ success: true, instructor });
  } catch (error) {
    console.error('Get Instructor Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch instructor', error: error.message });
  }
};

// Add Instructor (Admin only)
export const addInstructor = async (req, res) => {
  try {
    const { name, email, password, bio, expertise } = req.body;

    // Create User document with role 'instructor'
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already in use' });

    // Hash password handled in User model pre-save middleware if implemented

    const user = await User.create({
      name,
      email,
      password,
      role: 'instructor'
    });

    // Create Instructor document linked to User
    const instructor = await Instructor.create({
      user: user._id,
      bio,
      expertise
    });

    res.status(201).json({ success: true, message: 'Instructor added successfully', instructor });
  } catch (error) {
    console.error('Add Instructor Error:', error);
    res.status(500).json({ success: false, message: 'Failed to add instructor', error: error.message });
  }
};

// Update Instructor (Admin, Instructor themselves)
export const updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });

    // Authorization check to be done in middleware or here if needed

    const updates = req.body;
    Object.assign(instructor, updates);
    await instructor.save();

    res.json({ success: true, message: 'Instructor updated', instructor });
  } catch (error) {
    console.error('Update Instructor Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update instructor', error: error.message });
  }
};

// Delete Instructor (Admin only)
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });

    // Remove linked User as well to keep clean data
    await User.findByIdAndDelete(instructor.user);

    await instructor.remove();

    res.json({ success: true, message: 'Instructor deleted' });
  } catch (error) {
    console.error('Delete Instructor Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete instructor', error: error.message });
  }
};
