import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  ArrowRight,
  Award,
  CheckCircle,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Courses = () => {
  const navigate = useNavigate();
  const { token, userData } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              All Courses
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Master Your Law School
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Entrance Exams
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive preparation courses designed to help you succeed in LSAT and LNAT exams with expert guidance
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Course Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{coursesData.length}</h3>
            <p className="text-gray-600">Total Courses</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">4.7k+</h3>
            <p className="text-gray-600">Students Enrolled</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
            >
              {/* Featured Badge */}
              {course.featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </div>
              )}

              {/* Course Header */}
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 opacity-90" />
                  <h3 className="text-xl sm:text-2xl font-bold">{course.category}</h3>
                  <p className="text-blue-100 text-sm">Professional Preparation</p>
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-300 fill-current mr-1" />
                  <span className="text-sm font-semibold text-white">{course.rating}</span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                
                {/* Title Section */}
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 font-medium mb-2">{course.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed line-clamp-2">{course.description}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="font-bold text-gray-900 text-sm">{course.duration}</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="font-bold text-gray-900 text-sm">{Math.floor(course.studentsEnrolled/1000)}k+</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="font-bold text-gray-900 text-sm">Expert</p>
                    <p className="text-xs text-gray-500">Level</p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Key Features:
                  </h4>
                  <div className="space-y-2">
                    {course.highlights.slice(0, 3).map((highlight, index) => (
                      <div key={index} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                    {course.highlights.length > 3 && (
                      <p className="text-sm text-blue-600 font-medium ml-4">
                        +{course.highlights.length - 3} more features
                      </p>
                    )}
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {course.instructor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">{course.instructor.name}</p>
                      <p className="text-sm text-gray-600">{course.instructor.credentials}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ${course.originalPrice}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                          Save ${course.originalPrice - course.price}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful students who have achieved their law school dreams with our expert preparation courses.
            </p>
            <button
              onClick={() => {
                if (token && userData) {
                  toast.success('You are already signed in! Browse courses above.');
                } else {
                  navigate('/login?mode=signup');
                }
              }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {token && userData ? 'Browse Courses' : 'Get Started Today'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS for line clamping */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Courses;
