import React from 'react'
import { 
  Scale, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      
      {/* Main Footer Content - Fixed Container */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Logo & About Section - Mobile Optimized */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                LawEdu
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm pr-2">
              Empowering future legal professionals through expert-led education and comprehensive career guidance.
            </p>
            
            {/* Social Links - Mobile Optimized */}
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Instagram, href: '#', label: 'Instagram' }
              ].map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:scale-105"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links - Mobile Safe */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-4 text-base">Quick Links</h3>
            <nav aria-label="Footer Navigation">
              <ul className="space-y-2">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Instructors', href: '/instructors' },
                  { name: 'Courses', href: '/courses' },
                  { name: 'About', href: '/about' },
                  { name: 'Contact', href: '/contact' }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm block truncate"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal & Support - Mobile Safe */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-4 text-base">Support</h3>
            <ul className="space-y-2">
              {[
                'Privacy Policy',
                'Terms of Service', 
                'Help Center',
                'Student Support',
                'Cookie Policy'
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm block truncate"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Mobile Optimized */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-4 text-base">Contact</h3>
            <div className="space-y-3">
              
              {/* Phone - Mobile Safe */}
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <a 
                    href="tel:+12124567890" 
                    className="text-white hover:text-blue-400 transition-colors duration-300 text-sm block truncate"
                  >
                    +1-212-456-7890
                  </a>
                </div>
              </div>

              {/* Email - Mobile Safe */}
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <a 
                    href="mailto:contact@lawedu.com" 
                    className="text-white hover:text-green-400 transition-colors duration-300 text-sm block truncate"
                  >
                    contact@lawedu.com
                  </a>
                </div>
              </div>

              {/* Address - Mobile Safe */}
              <div className="flex items-start space-x-2 min-w-0">
                <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm leading-relaxed">
                    123 Legal District<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section - Mobile Optimized */}
      <div className="border-t border-gray-700 py-6">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h4 className="text-base font-semibold text-white mb-1">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Get weekly tips and insights</p>
            </div>
            <div className="flex w-full md:w-auto max-w-sm min-w-0">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 min-w-0 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-r-lg transition-all duration-300 text-sm flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Mobile Perfect */}
      <div className="border-t border-gray-700 py-4">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
              <span>&copy; {currentYear} LawEdu. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500" />
              <span>for future lawyers</span>
            </div>

            {/* Additional Links - Mobile Stack */}
            <div className="flex items-center space-x-4 text-xs sm:text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
