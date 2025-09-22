import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // Authentication states
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    
    // Data states
    const [dashboardData, setDashboardData] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    
    // Loading states
    const [loading, setLoading] = useState(false);

    // Authentication functions
    const login = async (email, password, type) => {
        try {
            setLoading(true);
            const endpoint = type === 'admin' ? '/api/admin/login' : '/api/instructor/login';
            const { data } = await axios.post(backendUrl + endpoint, { email, password });
            
            if (data.success) {
                setToken(data.token);
                setUserType(type);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userType', type);
                toast.success('Login successful');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken('');
        setUserType('');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setDashboardData(null);
        setInstructors([]);
        setConsultations([]);
        setProfileData(null);
        setAuditLogs([]);
    };

    // API request helper with authentication
    const apiRequest = async (endpoint, method = 'GET', data = null, isFormData = false) => {
        try {
            const config = {
                method,
                url: backendUrl + endpoint,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' })
                }
            };
            
            if (data) {
                config.data = data;
            }
            
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    // Dashboard data
    const getDashboardData = async () => {
        try {
            setLoading(true);
            const endpoint = userType === 'admin' ? '/api/admin/dashboard' : '/api/instructor/dashboard';
            const data = await apiRequest(endpoint);
            
            if (data.success) {
                setDashboardData(data.data || data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Instructors management (Admin only)
    const getInstructors = async () => {
        if (userType !== 'admin') return;
        
        try {
            const data = await apiRequest('/api/admin/all-instructors');
            if (data.success) {
                setInstructors(data.instructors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch instructors');
        }
    };

    const addInstructor = async (instructorData) => {
        if (userType !== 'admin') return false;
        
        try {
            setLoading(true);
            const data = await apiRequest('/api/admin/add-instructor', 'POST', instructorData, true);
            
            if (data.success) {
                toast.success(data.message);
                getInstructors(); // Refresh list
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message || 'Failed to add instructor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const toggleInstructorAvailability = async (instructorId) => {
        if (userType !== 'admin') return;
        
        try {
            const data = await apiRequest('/api/admin/change-instructor-availability', 'POST', { instructorId });
            
            if (data.success) {
                toast.success(data.message);
                getInstructors(); // Refresh list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update instructor availability');
        }
    };

    // Consultations management
    const getConsultations = async () => {
        try {
            const endpoint = userType === 'admin' ? '/api/admin/all-consultations' : '/api/instructor/consultations';
            const data = await apiRequest(endpoint);
            
            if (data.success) {
                setConsultations(data.consultations || data.appointments || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch consultations');
        }
    };

    const updateConsultationStatus = async (consultationId, status) => {
        try {
            const endpoint = userType === 'admin' 
                ? '/api/admin/cancel-appointment' 
                : `/api/instructor/${status === 'completed' ? 'complete' : 'cancel'}-consultation`;
                
            const data = await apiRequest(endpoint, 'POST', { 
                consultationId: consultationId,
                appointmentId: consultationId 
            });
            
            if (data.success) {
                toast.success(data.message);
                getConsultations(); // Refresh list
                getDashboardData(); // Update dashboard
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update consultation');
        }
    };

    // Profile management (Instructor only)
    const getProfile = async () => {
        if (userType !== 'instructor') return;
        
        try {
            const data = await apiRequest('/api/instructor/profile');
            if (data.success) {
                setProfileData(data.profileData || data.profile);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch profile');
        }
    };

    const updateProfile = async (profileData) => {
        if (userType !== 'instructor') return false;
        
        try {
            setLoading(true);
            const data = await apiRequest('/api/instructor/update-profile', 'POST', profileData);
            
            if (data.success) {
                toast.success(data.message);
                getProfile(); // Refresh profile
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Audit logs (Admin only)
    const getAuditLogs = async () => {
        if (userType !== 'admin') return;
        
        try {
            const data = await apiRequest('/api/admin/audit-logs');
            if (data.success) {
                setAuditLogs(data.auditLogs || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch audit logs');
        }
    };

    // Initialize data on mount and user type change
    useEffect(() => {
        if (token && userType) {
            getDashboardData();
            getConsultations();
            
            if (userType === 'admin') {
                getInstructors();
                getAuditLogs();
            } else if (userType === 'instructor') {
                getProfile();
            }
        }
    }, [token, userType]);

    const value = {
        // Auth
        userType,
        token,
        login,
        logout,
        loading,
        
        // Data
        dashboardData,
        instructors,
        consultations,
        profileData,
        auditLogs,
        
        // Functions
        getDashboardData,
        getInstructors,
        addInstructor,
        toggleInstructorAvailability,
        getConsultations,
        updateConsultationStatus,
        getProfile,
        updateProfile,
        getAuditLogs,
        
        // Utils
        backendUrl
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
