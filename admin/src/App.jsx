import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppContext } from './context/AppContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Admin/Dashboard'
import AddInstructor from './pages/Admin/AddInstructor'
import InstructorsList from './pages/Admin/InstructorsList'
import Consultations from './pages/Consultations'
import Profile from './pages/Instructor/Profile'

const App = () => {
  const { token, userType } = useContext(AppContext)

  const AdminRoutes = () => (
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/consultations" element={<Consultations />} />
      <Route path="/add-instructor" element={<AddInstructor />} />
      <Route path="/instructors" element={<InstructorsList />} />
      <Route path="/audit-logs" element={<div className="m-5"><h1 className="text-2xl">Audit Logs - Coming Soon</h1></div>} />
    </>
  )

  const InstructorRoutes = () => (
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/consultations" element={<Consultations />} />
      <Route path="/profile" element={<Profile />} />
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {token ? (
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                {userType === 'admin' && AdminRoutes()}
                {userType === 'instructor' && InstructorRoutes()}
                <Route path="*" element={<div className="m-5 text-center"><h1 className="text-2xl text-gray-600">Page Not Found</h1></div>} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App
