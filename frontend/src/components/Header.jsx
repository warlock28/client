import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { 
  ChevronRight, 
  Star, 
  Users, 
  Play,
  ArrowRight
} from 'lucide-react'

const Header = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Simplified Background - Only for larger screens */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[80vh] lg:min-h-screen py-12 lg:py-20 gap-8 lg:gap-12">
          
          {/* Left Content */}
          <div className={`w-full lg:w-1/2 text-center lg:text-left space-y-6 lg:space-y-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            
            {/* Badge - Hidden on small screens */}
            <div className="hidden sm:inline-flex items-center justify-center lg:justify-start">
              <div className="inline-flex items-center px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ Students</span>
              </div>
            </div>

            {/* Main Heading - Responsive text sizes */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Book Consultation
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  With Trusted
                </span>
                <br />
                Legal Experts
              </h1>
            </div>

            {/* Description - Simplified for mobile */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                Browse through our extensive list of trusted legal experts and schedule your consultation hassle-free.
              </p>

              {/* Social Proof - Simplified for mobile */}
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-blue-600 shadow-md"
                    ></div>
                  ))}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-gray-600">500+</span>
                  </div>
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium">Join 500+ legal professionals</span>
                </div>
              </div>

              {/* Stats - Simplified and responsive */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 sm:space-x-8 pt-2">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">100+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Experts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-indigo-600">10k+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-xs sm:text-sm text-gray-500">Success</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Responsive layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href='#speciality' 
                className="w-full sm:w-auto group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  Book Consultation
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </a>

              
            </div>

            {/* Trust Indicators - Only on larger screens */}
            <div className="hidden lg:flex items-center gap-4 pt-6 border-t border-gray-200">
              <span className="text-sm text-gray-500 font-medium">Trusted by:</span>
              <div className="flex items-center space-x-3 opacity-60">
                {['Baker McKenzie', 'Clifford Chance'].map((firm, index) => (
                  <div key={index} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                    {firm}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Simplified and responsive */}
          <div className={`w-full lg:w-1/2 mt-8 lg:mt-0 relative transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Floating Elements - Only on larger screens */}
              <div className="hidden lg:block absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              
              <div className="hidden lg:block absolute -bottom-6 -right-6 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>

              {/* Main Image */}
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl">
                <img 
                  className="w-full h-auto object-cover" 
                  src={assets.header_img} 
                  alt="Legal Education Platform"
                />
                {/* Simple overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
