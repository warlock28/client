import React from 'react'
import Header from '../components/Header'
import TopInstructors from '../components/TopInstructors'  // Fixed: Changed from TopDoctors to TopInstructors
import Banner from '../components/Banner'
import TopCourses from '../components/TopCourses'
import StudentTestimonials from '../components/StudentTestimonials'
const Home = () => {
  return (
    <div>
      <Header />
      <TopCourses />
      <TopInstructors />  
      <Banner />
      <StudentTestimonials />
      
    </div>
  )
}

export default Home
