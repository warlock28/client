import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Trophy } from 'lucide-react'
import { testimonialsData } from '../data/testimonialsData'

const StudentTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % testimonialsData.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 2
      return newIndex < 0 ? testimonialsData.length - 2 : newIndex
    })
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 2) % testimonialsData.length)
  }

  // Get current pair of testimonials
  const getCurrentTestimonials = () => {
    const first = testimonialsData[currentIndex]
    const second = testimonialsData[(currentIndex + 1) % testimonialsData.length]
    return [first, second]
  }

  const [firstTestimonial, secondTestimonial] = getCurrentTestimonials()

  // Simple Star Rating Component
  const StarRating = ({ rating, reviews }) => (
    <div className="flex items-center space-x-1 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating) 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-2">
        {rating} ({reviews} reviews)
      </span>
    </div>
  )

  // Clean Testimonial Card
  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      
      {/* Student Info */}
      <div className="flex items-center mb-4">
        <img
          src={`/assets/${testimonial.photo}`}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={testimonial.rating} reviews={testimonial.totalReviews} />

      {/* Testimonial Text */}
      <p className="text-gray-700 mb-4 leading-relaxed text-sm italic flex-1">
        "{testimonial.testimonial}"
      </p>

      {/* Score Improvement */}
      <div className="bg-green-50 p-4 rounded-lg mb-4 text-center border border-green-200">
        <p className="text-sm text-gray-600 mb-1">Score Improvement</p>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-xl font-bold text-gray-800">{testimonial.beforeScore}</span>
          <span className="text-gray-400">→</span>
          <span className="text-xl font-bold text-green-600">{testimonial.afterScore}</span>
          <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
            {testimonial.improvement}
          </span>
        </div>
      </div>

      {/* Law School */}
      <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
        <p className="text-sm text-gray-600 mb-1">Admitted to</p>
        <p className="text-lg font-bold text-blue-600">{testimonial.lawSchool}</p>
      </div>
    </div>
  )

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4 mr-1" />
            Success Stories
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Student
            <span className="text-green-600 ml-2">Success Stories</span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real results from our students who achieved their law school dreams
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TestimonialCard testimonial={firstTestimonial} />
          <TestimonialCard testimonial={secondTestimonial} />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={goToPrevious}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dot Indicators */}
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(testimonialsData.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 2)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / 2) === index
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial pair ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Simple Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
            <p className="text-sm text-gray-600">Students Placed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">+18</div>
            <p className="text-sm text-gray-600">Avg Improvement</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentTestimonials
