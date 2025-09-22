import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Trophy, Quote, TrendingUp, GraduationCap, Award, User } from 'lucide-react'
import { testimonialsData } from '../data/testimonialsData'

const StudentTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState({})

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length)
  }

  // Handle image load errors
  const handleImageError = (testimonialId) => {
    setImageErrors(prev => ({ ...prev, [testimonialId]: true }))
  }

  // Enhanced Star Rating
  const StarRating = ({ rating, reviews }) => (
    <div className="flex items-center justify-center space-x-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 transition-all duration-300 ${
            star <= Math.floor(rating) 
              ? 'text-amber-400 fill-current drop-shadow-sm' 
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm font-medium text-gray-600 ml-3">
        {rating} • {reviews} reviews
      </span>
    </div>
  )

  // Profile Image Component with fallback
  const ProfileImage = ({ testimonial }) => {
    const hasError = imageErrors[testimonial.id]
    
    return (
      <div className="relative mb-4 sm:mb-0">
        {!hasError ? (
          <img
            src={`/assets/testimonials/${testimonial.photo}`}
            alt={testimonial.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            onError={() => handleImageError(testimonial.id)}
            onLoad={() => setImageErrors(prev => ({ ...prev, [testimonial.id]: false }))}
          />
        ) : (
          // Fallback avatar with initials
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {testimonial.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        
        {/* Achievement badge */}
        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
          <Award className="w-4 h-4 text-white" />
        </div>
      </div>
    )
  }

  // Enhanced Testimonial Card
  const TestimonialCard = ({ testimonial, isActive }) => (
    <div className={`
      relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100
      transform transition-all duration-700 hover:scale-105 hover:shadow-2xl
      ${isActive ? 'opacity-100 translate-x-0' : 'opacity-75 translate-x-4'}
      p-8 h-full flex flex-col overflow-hidden
    `}>
      
      {/* Decorative Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10">
        <Quote className="w-16 h-16 text-blue-600" />
      </div>

      {/* Student Profile Header with Enhanced Image */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start mb-6">
        <ProfileImage testimonial={testimonial} />
        
        <div className="sm:ml-6 text-center sm:text-left flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{testimonial.name}</h3>
          <p className="text-blue-600 font-semibold text-sm mb-2">{testimonial.role}</p>
          <StarRating rating={testimonial.rating} reviews={testimonial.totalReviews} />
        </div>
      </div>

      {/* Testimonial Quote */}
      <div className="relative z-10 flex-1 mb-6">
        <p className="text-gray-700 leading-relaxed text-center sm:text-left italic text-lg">
          "{testimonial.testimonial}"
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Score Improvement */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-800">Score Jump</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-lg font-bold text-gray-700">{testimonial.beforeScore}</span>
            <div className="flex flex-col items-center">
              <div className="w-8 h-0.5 bg-gradient-to-r from-gray-400 to-green-500"></div>
              <span className="text-xs text-gray-500 mt-1">to</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{testimonial.afterScore}</span>
          </div>
          <div className="mt-2">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
              {testimonial.improvement}
            </span>
          </div>
        </div>

        {/* Law School Achievement */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-semibold text-blue-800">Admitted</span>
          </div>
          <p className="text-lg font-bold text-blue-700 leading-tight">
            {testimonial.lawSchool}
          </p>
          <div className="mt-2">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              TOP TIER
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-700 text-sm font-bold mb-6 border border-green-200">
            <Trophy className="w-5 h-5 mr-2" />
            SUCCESS STORIES
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gray-900">Real Students,</span>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent ml-3">
              Real Results
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our students transformed their LSAT scores and secured admission to their dream law schools
          </p>
        </div>

        {/* Mobile-First Testimonial Display */}
        <div className="relative mb-12">
          
          {/* Single Card for Mobile, Multiple for Desktop */}
          <div className="block md:hidden">
            <TestimonialCard 
              testimonial={testimonialsData[currentIndex]} 
              isActive={true}
            />
          </div>

          {/* Desktop: Show 2 cards side by side */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            <TestimonialCard 
              testimonial={testimonialsData[currentIndex]} 
              isActive={true}
            />
            <TestimonialCard 
              testimonial={testimonialsData[(currentIndex + 1) % testimonialsData.length]} 
              isActive={true}
            />
          </div>
        </div>

        {/* Enhanced Navigation Controls */}
        <div className="flex items-center justify-center space-x-6 mb-16">
          <button
            onClick={goToPrevious}
            className="group p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Enhanced Dot Indicators */}
          <div className="flex space-x-3">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-10 h-3 bg-gradient-to-r from-blue-500 to-green-500'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="group p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { 
              value: "500+", 
              label: "Students Placed", 
              color: "from-blue-500 to-blue-600",
              icon: GraduationCap,
              bgColor: "from-blue-50 to-blue-100"
            },
            { 
              value: "+18", 
              label: "Avg Score Increase", 
              color: "from-green-500 to-green-600",
              icon: TrendingUp,
              bgColor: "from-green-50 to-green-100"
            },
            { 
              value: "98%", 
              label: "Success Rate", 
              color: "from-purple-500 to-purple-600",
              icon: Trophy,
              bgColor: "from-purple-50 to-purple-100"
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} p-8 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1`}
            >
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <p className="text-gray-700 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StudentTestimonials
