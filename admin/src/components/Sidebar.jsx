import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Sidebar = () => {
  const { userType } = useContext(AppContext)

  const NavItem = ({ to, icon, children }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
          isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
        }`
      }
    >
      <img className='min-w-5' src={icon} alt="" />
      <p className='hidden md:block'>{children}</p>
    </NavLink>
  )

  return (
    <div className='min-h-screen bg-white border-r'>
      {userType === 'admin' && (
        <ul className='mt-5'>
          <NavItem to="/dashboard" icon={assets.home_icon}>
            Dashboard
          </NavItem>
          
          <NavItem to="/consultations" icon={assets.appointment_icon}>
            Consultations
          </NavItem>
          
          <NavItem to="/add-instructor" icon={assets.add_icon}>
            Add Instructor
          </NavItem>
          
          <NavItem to="/instructors" icon={assets.people_icon}>
            Instructors List
          </NavItem>
          
          <NavItem to="/audit-logs" icon={assets.list_icon}>
            Audit Logs
          </NavItem>
        </ul>
      )}

      {userType === 'instructor' && (
        <ul className='mt-5'>
          <NavItem to="/dashboard" icon={assets.home_icon}>
            Dashboard
          </NavItem>
          
          <NavItem to="/consultations" icon={assets.appointment_icon}>
            My Consultations
          </NavItem>
          
          <NavItem to="/profile" icon={assets.people_icon}>
            Profile
          </NavItem>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
