import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'

const Profile = () => {
    const { profileData, getProfile, updateProfile, loading } = useContext(AppContext)
    const [formData, setFormData] = useState({
        fees: '',
        about: '',
        available: true
    })
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        getProfile()
    }, [])

    useEffect(() => {
        if (profileData) {
            setFormData({
                fees: profileData.fees || '',
                about: profileData.about || '',
                available: profileData.available !== undefined ? profileData.available : true
            })
        }
    }, [profileData])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await updateProfile(formData)
        if (success) {
            setIsEditing(false)
        }
    }

    if (loading && !profileData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="m-5 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                            <img
                                src={profileData?.image || '/api/placeholder/80/80'}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">{profileData?.name || 'Unknown Instructor'}</h2>
                            <p className="text-blue-100">{profileData?.email || 'No email'}</p>
                            <p className="text-blue-100">{profileData?.expertise || 'No expertise listed'}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Consultation Fees (USD)
                                    </label>
                                    <input
                                        type="number"
                                        name="fees"
                                        value={formData.fees}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your consultation fees"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="available"
                                            name="available"
                                            checked={formData.available}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="available" className="text-sm font-medium text-gray-700">
                                            Available for consultations
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    About Me
                                </label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tell students about yourself, your experience, and expertise..."
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Basic Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-gray-500">Experience:</span>
                                            <p className="text-gray-800">{profileData?.experience || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Education:</span>
                                            <p className="text-gray-800">{profileData?.education || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Consultation Fees:</span>
                                            <p className="text-gray-800">${profileData?.fees || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Status:</span>
                                            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                profileData?.available 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {profileData?.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {profileData?.about || 'No description provided.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
