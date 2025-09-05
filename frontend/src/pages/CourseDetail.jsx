import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Play,
  Award,
  Calendar,
  Globe,
  Download,
  MessageCircle,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import axios from 'axios';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [course, setCourse] = useState(null);
  const [courseFaqs, setCourseFaqs] = useState([]);

  // Fetch course data from backend API
  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`/api/courses/${courseId}`);
        if (res.data.success) {
          setCourse(res.data.course);
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error(error);
        setCourse(null);
      }
    }

    async function fetchFaqs() {
      try {
        const res = await axios.get(`/api/courses/${courseId}/faqs`);
        if (res.data.success) {
          setCourseFaqs(res.data.faqs);
        } else {
          setCourseFaqs([]);
        }
      } catch (error) {
        console.error(error);
        setCourseFaqs([]);
      }
    }

    fetchCourse();
    fetchFaqs();
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Calendar },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Course Hero */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 opacity-90" />
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{course.category}</h1>
                  <p className="text-blue-100 mt-2 text-sm sm:text-base">Master Your Preparation</p>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                    <p className="text-base sm:text-lg text-gray-600">{course.subtitle}</p>
                  </div>

                  <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full self-start">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current mr-2" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{course.rating}</span>
                    <span className="text-gray-500 ml-1 text-sm">({course.studentsEnrolled.toLocaleString()})</span>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{course.duration}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Duration</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {Math.floor(course.studentsEnrolled / 1000)}k+
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">Students</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{course.level}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Level</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Online</p>
                    <p className="text-xs sm:text-sm text-gray-500">Format</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg">
              <div className="border-b overflow-x-auto">
                <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-8 min-w-max">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Course Description</h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{course.longDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {course.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-600 text-sm sm:text-base">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Course Curriculum</h3>
                    {course.curriculum.map((week, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Week {week.week}: {week.title}
                          </h4>
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                        <ul className="space-y-2">
                          {week.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="text-gray-600 text-sm flex items-start">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* FAQs Tab */}
                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    {courseFaqs.length > 0 ? (
                      <div className="space-y-3">
                        {courseFaqs.map((faq, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              className="w-full px-4 sm:px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => toggleFaq(index)}
                            >
                              <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{faq.question}</span>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                                  openFaqIndex === index ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            {openFaqIndex === index && (
                              <div className="px-4 sm:px-6 pb-4 text-gray-700 text-sm sm:text-base leading-relaxed border-t border-gray-100">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No FAQs available for this course yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">Student reviews coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 sticky top-20 sm:top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{course.price}</span>
                  {course.originalPrice && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through">₹{course.originalPrice}</span>
                  )}
                </div>
                {course.originalPrice && (
                  <p className="text-green-600 font-medium text-sm sm:text-base">
                    Save ₹{course.originalPrice - course.price}!
                  </p>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
                  Enroll Now
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg sm:rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Preview Course
                </button>
              </div>

              <div className="border-t pt-4 sm:pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Online & offline access</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Discussion forum access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
