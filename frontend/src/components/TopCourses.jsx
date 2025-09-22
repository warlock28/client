import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  Award,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { coursesData } from '../data/coursesData'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const TopCourses = () => {
  const navigate = useNavigate()
  const { token, userData } = useContext(AppContext)
  const [hoveredCourse, setHoveredCourse] = useState(null)

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-1" />
            Featured Courses
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Master Your Law School
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Entrance Exams
            </span>
          </h2>
          
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Expert preparation courses for LSAT and LNAT success
          </p>
        </div>

        {/* Courses Grid - Mobile First Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className={`group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                hoveredCourse === course.id ? 'sm:transform sm:scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              {/* Featured Badge */}
              {course.featured && (
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </div>
              )}

              {/* Course Header - Compact for Mobile */}
              <div className="relative h-32 sm:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-90" />
                  <h3 className="text-lg sm:text-xl font-bold">{course.category}</h3>
                  <p className="text-blue-100 text-sm hidden sm:block">Professional Preparation</p>
                </div>
                
                {/* Rating Badge - Smaller on Mobile */}
                <div className="absolute top-3 right-3 flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 text-yellow-300 fill-current mr-1" />
                  <span className="text-xs font-semibold text-white">{course.rating}</span>
                </div>
              </div>

              {/* Course Content - Mobile Optimized */}
              <div className="p-4 sm:p-6">
                
                {/* Title Section - Compact */}
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer transition-colors duration-200 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 font-medium text-sm mb-2 hidden sm:block">{course.subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">{course.description}</p>
                </div>

                {/* Stats Grid - Mobile Optimized */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-1" />
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{course.duration}</p>
                    <p className="text-xs text-gray-500 hidden sm:block">Duration</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-1" />
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{Math.floor(course.studentsEnrolled/1000)}k+</p>
                    <p className="text-xs text-gray-500 hidden sm:block">Students</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1" />
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">Expert</p>
                    <p className="text-xs text-gray-500 hidden sm:block">Level</p>
                  </div>
                </div>

                {/* Key Features - Mobile Limited */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Key Features:
                  </h4>
                  <div className="space-y-1">
                    {/* Show only 2 features on mobile, 4 on desktop */}
                    {course.highlights.slice(0, 4).map((highlight, index) => (
                      <div key={index} className={`flex items-start text-xs sm:text-sm text-gray-600 ${index >= 2 ? 'hidden sm:flex' : ''}`}>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        <span className="line-clamp-1">{highlight}</span>
                      </div>
                    ))}
                    {course.highlights.length > 4 && (
                      <p className="text-xs text-blue-600 font-medium ml-3.5">
                        +{course.highlights.length - 4} more features
                      </p>
                    )}
                  </div>
                </div>

                {/* Instructor Info - Hidden on Mobile */}
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hidden sm:block">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {course.instructor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900 text-sm">{course.instructor.name}</p>
                      <p className="text-xs text-gray-600">{course.instructor.credentials}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing and CTA - Mobile Optimized */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <>
                        <span className="text-sm text-gray-400 line-through hidden sm:inline">
                          ${course.originalPrice}
                        </span>
                        <span className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs font-semibold hidden sm:inline">
                          Save ${course.originalPrice - course.price}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="group inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                  >
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                    <ArrowRight className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action - Mobile Optimized */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Ready to Start?
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Join successful students achieving their law school dreams
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Explore All Courses
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS for line clamping */}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default TopCourses
