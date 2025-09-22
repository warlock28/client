import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Star, 
  Search,
  Filter,
  MapPin, 
  Video, 
  Users, 
  Calendar,
  BookOpen,
  Award,
  Clock,
  GraduationCap,
  Badge,
  ChevronDown,
  X
} from 'lucide-react';

const InstructorsPage = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options
  const [specializations, setSpecializations] = useState([]);
  const meetingTypes = ['online', 'in-person', 'both'];
  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'hourlyRate', label: 'Price: Low to High' },
    { value: 'hourlyRate_desc', label: 'Price: High to Low' },
    { value: 'totalBookings', label: 'Most Experienced' },
    { value: 'name', label: 'Name A-Z' }
  ];

  useEffect(() => {
    fetchInstructors();
  }, []);

  useEffect(() => {
    filterInstructors();
  }, [instructors, searchTerm, selectedSpecialization, selectedMeetingType, minRating, sortBy]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/instructors`);
      if (data.success) {
        setInstructors(data.instructors);
        
        // Extract unique specializations
        const uniqueSpecializations = [...new Set(
          data.instructors.flatMap(instructor => instructor.specializations || [])
        )];
        setSpecializations(uniqueSpecializations);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const filterInstructors = () => {
    let filtered = [...instructors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(instructor =>
        instructor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.specializations?.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        instructor.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Specialization filter
    if (selectedSpecialization) {
      filtered = filtered.filter(instructor =>
        instructor.specializations?.includes(selectedSpecialization)
      );
    }

    // Meeting type filter
    if (selectedMeetingType) {
      filtered = filtered.filter(instructor =>
        instructor.meetingPreference === selectedMeetingType ||
        instructor.meetingPreference === 'both'
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(instructor =>
        instructor.rating >= minRating
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'hourlyRate':
          return a.hourlyRate - b.hourlyRate;
        case 'hourlyRate_desc':
          return b.hourlyRate - a.hourlyRate;
        case 'totalBookings':
          return (b.totalBookings || 0) - (a.totalBookings || 0);
        case 'name':
          return (a.user?.name || '').localeCompare(b.user?.name || '');
        default:
          return 0;
      }
    });

    setFilteredInstructors(filtered);
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
    const hasAvailability = Object.values(instructor.availability || {}).some(
      day => day.available && day.slots && day.slots.length > 0
    );
    return hasAvailability;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedMeetingType('');
    setMinRating(0);
    setSortBy('rating');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">Loading instructors...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Expert Legal Instructors
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully selected team of experienced legal educators and practitioners
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, specialization, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Specialization Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Meeting Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type
                </label>
                <select
                  value={selectedMeetingType}
                  onChange={(e) => setSelectedMeetingType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="online">Online Only</option>
                  <option value="in-person">In-Person Only</option>
                  <option value="both">Both Options</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="lg:col-span-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600 mt-4">
            Showing {filteredInstructors.length} of {instructors.length} instructors
          </div>
        </div>

        {/* Instructors Grid */}
        {filteredInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstructors.map((instructor) => (
              <div
                key={instructor._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Instructor Image/Avatar */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700">
                  {instructor.profileImage ? (
                    <img
                      src={instructor.profileImage}
                      alt={instructor.user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        getAvailabilityStatus(instructor)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        getAvailabilityStatus(instructor) ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      {getAvailabilityStatus(instructor) ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>

                {/* Instructor Details */}
                <div className="p-6">
                  {/* Name and Experience */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {instructor.user?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {instructor.experience} of experience
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
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

                  {/* Bio Preview */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {instructor.bio}
                  </p>

                  {/* Specializations */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {instructor.specializations?.slice(0, 2).map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {spec}
                        </span>
                      ))}
                      {instructor.specializations?.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{instructor.specializations.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {instructor.totalBookings || 0}
                      </div>
                      <div className="text-xs text-gray-500">Sessions</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{instructor.hourlyRate}
                      </div>
                      <div className="text-xs text-gray-500">Per Hour</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {instructor.completedSessions || 0}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>

                  {/* Meeting Types */}
                  <div className="flex justify-center mb-4 space-x-3">
                    {(instructor.meetingPreference === 'online' || instructor.meetingPreference === 'both') && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Video className="w-3 h-3 mr-1" />
                        Online
                      </div>
                    )}
                    {(instructor.meetingPreference === 'in-person' || instructor.meetingPreference === 'both') && (
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        In-Person
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBookNow(instructor._id)}
                      disabled={!getAvailabilityStatus(instructor)}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        getAvailabilityStatus(instructor)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Now
                    </button>
                    <Link
                      to={`/instructor-profile/${instructor._id}`}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No instructors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorsPage;
