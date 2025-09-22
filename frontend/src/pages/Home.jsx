import React from 'react'
import Header from '../components/Header'
 // Fixed: Changed from TopDoctors to TopInstructors
import Banner from '../components/Banner'
import TopCourses from '../components/TopCourses'
import FeaturedInstructors from '../components/FeaturedInstructors'
import StudentTestimonials from '../components/StudentTestimonials'
const Home = () => {
  return (
    <div>
      <Header />
      <TopCourses />
      <FeaturedInstructors />
  
      <Banner />
      <StudentTestimonials />
      
    </div>
  )
}

export default Home
