import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className="my-12 sm:my-16 mx-4 sm:mx-6 lg:mx-10">
      {/* Main Banner Container */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl lg:rounded-2xl overflow-hidden shadow-xl">
        
        {/* Content Container */}
        <div className="flex flex-col lg:flex-row items-center px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left text-white space-y-4 sm:space-y-6">
            
            {/* Badge - Only on larger screens */}
            <div className="hidden sm:inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">
              <Star className="w-4 h-4 text-yellow-300 mr-2" />
              <span>Join Legal Excellence</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Book Consultation
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                With{' '}
                <span className="text-yellow-300">100+ Trusted</span>
                {' '}Experts
              </h3>
            </div>

            {/* Description - Only on larger screens */}
            <p className="hidden sm:block text-white/90 text-sm md:text-base max-w-lg mx-auto lg:mx-0">
              Connect with experienced legal professionals and advance your career with personalized guidance.
            </p>

            {/* Stats - Simplified for mobile */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-6 text-white/90 text-sm sm:text-base">
              <div className="text-center">
                <div className="font-bold">100+</div>
                <div className="text-xs opacity-80">Experts</div>
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="text-center">
                <div className="font-bold">5k+</div>
                <div className="text-xs opacity-80">Students</div>
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="text-center">
                <div className="font-bold flex items-center justify-center">
                  4.9 <Star className="w-3 h-3 fill-yellow-300 text-yellow-300 ml-1" />
                </div>
                <div className="text-xs opacity-80">Rating</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button 
                onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </button>
            </div>

            {/* Social Proof - Only on larger screens */}
            <div className="hidden lg:flex items-center space-x-3 pt-4 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white bg-blue-400"
                  ></div>
                ))}
              </div>
              <span className="text-white/80">Join 5,000+ legal professionals</span>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:pl-8">
            <div className="relative max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
              <div className="rounded-xl lg:rounded-2xl overflow-hidden shadow-lg lg:shadow-2xl">
                <img 
                  className="w-full h-auto object-cover" 
                  src={assets.appointment_img} 
                  alt="Legal Consultation Platform"
                />
              </div>

              {/* Simple notification - Only on tablet and up */}
              <div className="hidden md:block absolute top-4 right-4 bg-white/95 rounded-lg p-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-xs">
                    <div className="font-bold text-gray-900">New Booking!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
