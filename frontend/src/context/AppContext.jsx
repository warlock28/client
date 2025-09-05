import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';


export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [instructors, setInstructors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  // Set axios default Authorization header on token change
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch Instructors data using API
  const getInstructorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/instructors`);
      if (data.success) {
        setInstructors(data.instructors);
      } else {
        toast.error(data.message || "Failed to fetch instructors");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch User Profile data using API
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/profile`);
      if (data.success) {
        setUserData(data.user);
      } else {
        setUserData(null);
        toast.error(data.message || "Failed to load user profile");
      }
    } catch (error) {
      console.error(error);
      setUserData(null);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Initial load - instructors
  useEffect(() => {
    getInstructorsData();
  }, []);

  // Load user profile when token exists
  useEffect(() => {
    if (token) {
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
    loadUserProfileData,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
