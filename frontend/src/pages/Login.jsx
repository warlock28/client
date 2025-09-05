import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, BookOpen } from 'lucide-react';

const Login = () => {
  const { backendUrl, token, setToken, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up'); // toggle between 'Sign Up' and 'Login'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Submit login or signup form
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint = state === 'Sign Up' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        state === 'Sign Up'
          ? { name: formData.name, email: formData.email, password: formData.password }
          : { email: formData.email, password: formData.password };

      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUserData(data.user);
        toast.success(state === 'Sign Up' ? 'Account created successfully!' : 'Welcome back!');
        navigate('/');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Toggle form state between 'Sign Up' and 'Login'
  const toggleState = () => {
    setState(prev => (prev === 'Sign Up' ? 'Login' : 'Sign Up'));
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false);
  };

  // Redirect to home if already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {state === 'Sign Up' ? 'Join LawEdu' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {state === 'Sign Up' ? 'Create your account to start learning' : 'Sign in to continue your legal education'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className={`transition-all duration-300 ${state === 'Sign Up' ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                  required={state === 'Sign Up'}
                  tabIndex={state === 'Sign Up' ? 0 : -1}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {state === 'Sign Up' ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                state === 'Sign Up' ? 'Create Account' : 'Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleState}
                  className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors"
                >
                  {state === 'Sign Up' ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By {state === 'Sign Up' ? 'creating an account' : 'signing in'}, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
