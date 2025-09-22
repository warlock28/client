import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";



export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [instructors, setInstructors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);
  const [instructorProfile, setInstructorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Logout function to clear all auth data
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserData(null);
    setInstructorProfile(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Set axios default Authorization header on token change
  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      if (token && isTokenExpired(token)) {
        // Token is expired, clear it
        logout();
        toast.error('Session expired. Please log in again.');
      }
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Add axios interceptor to handle 401 errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          toast.error('Session expired. Please log in again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Fetch Instructors data using API
  const getInstructorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/instructors`);
      if (data.success) {
        setInstructors(data.instructors);
      }
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
      // Don't show error toast for instructors, as it's not critical
    }
  };

  // Fetch User Profile data using API
  const loadUserProfileData = async () => {
    if (!token || isTokenExpired(token)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/profile`);
      if (data.success) {
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Profile load error:', error);
      if (error.response?.status === 401) {
        // Token is invalid, will be handled by interceptor
        return;
      }
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load - instructors
  useEffect(() => {
    getInstructorsData();
  }, []);

  // Load user profile when token exists
  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  const value = {
    instructors,
    getInstructorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    instructorProfile,
    setInstructorProfile,
    loadUserProfileData,
    logout,
    isLoading,
    isTokenExpired,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
