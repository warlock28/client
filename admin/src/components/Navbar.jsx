import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { userType, logout } = useContext(AppContext)

  const handleLogout = () => {
    logout()
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 capitalize'>
          {userType}
        </p>
      </div>
      <button 
        onClick={handleLogout} 
        className='bg-blue-600 hover:bg-blue-700 text-white text-sm px-10 py-2 rounded-full transition-colors'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
