import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Consultation from './pages/Consultation'  // Fixed: renamed from Appointment
import MyConsultations from './pages/MyConsultations'  // Fixed: renamed from MyAppointments
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import Instructors from './pages/instructors';
import TopCourses from './components/TopCourses'
import CourseDetail from './pages/CourseDetail'
import StudentTestimonials from './components/StudentTestimonials'



const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/instructors' element={<Instructors />} />  {/* Fixed: plural form */}
        <Route path='/instructors/:speciality' element={<Instructors />} />  {/* Fixed: plural form */}
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/consultation/:instructorId' element={<Consultation />} />  {/* Fixed: consultation + instructorId */}
        <Route path='/my-consultations' element={<MyConsultations />} />  {/* Fixed: consultations */}
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/courses' element={<TopCourses />} />
        <Route path='/course/:courseId' element={<CourseDetail />} />
        <Route path='/testimonials' element={<StudentTestimonials />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
