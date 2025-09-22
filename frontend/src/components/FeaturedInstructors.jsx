import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Star, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Calendar,
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';

const FeaturedInstructors = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedInstructors();
  }, []);

  const fetchFeaturedInstructors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/instructors`);
      if (data.success) {
        // Get top 3 instructors based on rating
        const featured = data.instructors
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setInstructors(featured);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (instructorId) => {
    if (!token) {
      toast.info('Please login to book an appointment');
      navigate('/login');
      return;
    }
    navigate(`/book-instructor/${instructorId}`);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAvailabilityStatus = (instructor) => {
    // Simple check for availability (you can make this more sophisticated)
    const hasAvailability = Object.values(instructor.availability || {}).some(
      day => day.available && day.slots && day.slots.length > 0
    );
    return hasAvailability;
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Instructors</h2>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Instructors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from the best legal educators with years of experience in law school preparation and legal practice
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor._id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Instructor Image/Avatar */}
              <div className="relative h-64 bg-gradient-to-br from-blue-600 to-indigo-700">
                {instructor.profileImage ? (
                  <img
                    src={instructor.profileImage}
                    alt={instructor.user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      getAvailabilityStatus(instructor)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      getAvailabilityStatus(instructor) ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    {getAvailabilityStatus(instructor) ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>

              {/* Instructor Details */}
              <div className="p-6">
                {/* Name and Title */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {instructor.user?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {instructor.experience} • {instructor.specializations?.[0]}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-2">
                    {getRatingStars(instructor.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {instructor.rating}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({instructor.totalReviews} reviews)
                  </span>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {instructor.specializations?.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {spec}
                      </span>
                    ))}
                    {instructor.specializations?.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{instructor.specializations.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-gray-600 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        {instructor.totalBookings || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Award className="w-4 h-4 text-gray-600 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{instructor.hourlyRate}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Per Hour</p>
                  </div>
                </div>

                {/* Meeting Preferences */}
                <div className="flex items-center justify-center mb-6 space-x-4">
                  {instructor.meetingPreference === 'online' && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Video className="w-4 h-4 mr-1" />
                      Online Only
                    </div>
                  )}
                  {instructor.meetingPreference === 'in-person' && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      In-Person Only
                    </div>
                  )}
                  {instructor.meetingPreference === 'both' && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Video className="w-4 h-4 mr-1" />
                        Online
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        In-Person
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookNow(instructor._id)}
                    disabled={!getAvailabilityStatus(instructor)}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      getAvailabilityStatus(instructor)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </button>
                  <Link
                    to={`/instructor-profile/${instructor._id}`}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Instructors Link */}
        <div className="text-center mt-12">
          <Link
            to="/instructors"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50"
          >
            View All Instructors
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInstructors;
