import React from 'react'
import { assets } from '../assets/assets'
import { 
  Scale, 
  Users, 
  Award, 
  BookOpen, 
  Target, 
  Zap,
  Heart,
  CheckCircle,
  Star
} from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      
      {/* Container with proper responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* About Us Header - Mobile Optimized */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Scale className="w-4 h-4 mr-2" />
            About Our Platform
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ABOUT
            <span className="block sm:inline bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-0 sm:ml-2">
              LAWEDU
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in law school preparation and legal career advancement
          </p>
        </div>

        {/* Main About Content Section - Mobile First */}
        <div className="mb-16 sm:mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Image Section - Responsive */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <img 
                  className="w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-2xl shadow-2xl object-cover" 
                  src={assets.about_image} 
                  alt="LawEdu - Legal Education Platform"
                />
                {/* Floating Stats Card */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4 hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">4.9/5</div>
                      <div className="text-xs text-gray-500">Student Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section - Mobile Optimized */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                  Welcome to <span className="font-semibold text-blue-600">LawEdu</span>, your trusted partner in achieving law school admission success. We understand the challenges aspiring lawyers face when preparing for LSAT, LNAT, and law school applications.
                </p>
                
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                  LawEdu is committed to excellence in legal education. We continuously enhance our platform, integrating the latest teaching methodologies and expert insights to improve your learning experience and deliver superior results.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Our mission is to create a seamless legal education experience for every student. We bridge the gap between aspiration and achievement, making it easier for you to access expert guidance and reach your law school dreams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              WHY CHOOSE
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-2">
                LAWEDU
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes us the preferred choice for law school preparation
            </p>
          </div>

          {/* Features Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Feature 1 */}
            <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">EFFICIENCY</h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined learning paths and study schedules designed to fit your busy lifestyle and maximize your preparation time.
              </p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                Optimized Study Plans
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">EXPERT GUIDANCE</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to a network of top-tier legal education experts and instructors from prestigious law schools worldwide.
              </p>
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                99th Percentile Instructors
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer md:col-span-1">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">PERSONALIZATION</h3>
              <p className="text-gray-600 leading-relaxed">
                Tailored study recommendations, progress tracking, and personalized feedback to help you achieve your target scores.
              </p>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                AI-Powered Learning
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section - Mobile Optimized */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h3>
            <p className="text-gray-600">
              Real results that speak for our commitment to your success
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600 text-sm sm:text-base">Students Placed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">98%</div>
              <p className="text-gray-600 text-sm sm:text-base">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">+18</div>
              <p className="text-gray-600 text-sm sm:text-base">Avg Score Boost</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <p className="text-gray-600 text-sm sm:text-base">Expert Support</p>
            </div>
          </div>
        </div>

        {/* Call to Action - Mobile Friendly */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-6 h-6" />
              <span className="text-lg font-medium">Join Our Community</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Start Your Law School Journey?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful students who achieved their dreams with LawEdu
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Your Preparation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
