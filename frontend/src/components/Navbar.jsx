import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { 
  UserCircle, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Calendar, 
  LogOut,
  Scale,
  BookOpen,
  Phone,
  Home,
  Users,
  Settings,
  BarChart3
} from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { token, setToken, userData, setUserData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    setUserData(false)
    setShowProfileMenu(false)
    navigate('/')
  }

  const closeMenu = () => {
    setShowMenu(false)
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <Scale className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LawEdu
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { to: '/', label: 'Home', icon: Home },
                { to: '/instructors', label: 'Instructors', icon: Users },
                { to: '/courses', label: 'Courses', icon: BookOpen },
                { to: '/about', label: 'About', icon: BookOpen },
                { to: '/contact', label: 'Contact', icon: Phone },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>

            {/* Right Side - Auth Section */}
            <div className="flex items-center space-x-4">
              {token && userData ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100">
                      {userData.image ? (
                        <img 
                          src={userData.image} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:block text-gray-700 font-medium">
                      {userData.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{userData.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { icon: BarChart3, label: 'Dashboard', onClick: () => navigate('/dashboard') },
                          { icon: User, label: 'My Profile', onClick: () => navigate('/my-profile') },
                          { icon: Calendar, label: 'My Consultations', onClick: () => navigate('/my-consultations') },
                          { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
                          { icon: LogOut, label: 'Logout', onClick: logout },
                        ].map((item, index) => {
                          const Icon = item.icon
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                item.onClick()
                                setShowProfileMenu(false)
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button 
                    onClick={() => navigate('/login')} 
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/register')} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Register
                  </button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setShowMenu(true)}
                className="w-6 md:hidden"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMenu}></div>
            <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <span className="text-xl font-bold text-gray-900">Menu</span>
                <button onClick={closeMenu}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="px-6 py-4">
                {/* Mobile Auth Section */}
                {token && userData ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userData.name}</p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => { navigate('/my-profile'); closeMenu() }}
                        className="w-full text-left py-2 text-gray-700 hover:text-blue-600"
                      >
                        My Profile
                      </button>
                      <button 
                        onClick={() => { navigate('/my-consultations'); closeMenu() }}
                        className="w-full text-left py-2 text-gray-700 hover:text-blue-600"
                      >
                        My Consultations
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full text-left py-2 text-red-600 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 space-y-3">
                    <button 
                      onClick={() => { navigate('/login'); closeMenu() }}
                      className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => { navigate('/register'); closeMenu() }}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium"
                    >
                      Register
                    </button>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <nav className="space-y-1">
                  {[
                    { to: '/', label: 'Home', icon: Home },
                    { to: '/instructors', label: 'Instructors', icon: Users },
                    { to: '/courses', label: 'Courses', icon: BookOpen },
                    { to: '/about', label: 'About', icon: BookOpen },
                    { to: '/contact', label: 'Contact', icon: Phone },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside handler */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}
    </>
  )
}

export default Navbar
