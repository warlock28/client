import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AddInstructor = () => {
    const [instructorData, setInstructorData] = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
        expertise: '',
        experience: '',
        education: '',
        fees: '',
        about: '',
        image: null
    })

    const { addInstructor, loading } = useContext(AppContext)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInstructorData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setInstructorData(prev => ({
            ...prev,
            image: file
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData()
        Object.keys(instructorData).forEach(key => {
            if (instructorData[key] !== null && instructorData[key] !== '') {
                formData.append(key, instructorData[key])
            }
        })

        const success = await addInstructor(formData)
        if (success) {
            // Reset form
            setInstructorData({
                name: '',
                email: '',
                password: '',
                bio: '',
                expertise: '',
                experience: '',
                education: '',
                fees: '',
                about: '',
                image: null
            })
        }
    }

    return (
        <div className="m-5 w-full max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Instructor</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <label htmlFor="image" className="cursor-pointer">
                                <img
                                    className="w-20 h-20 rounded-full object-cover bg-gray-100"
                                    src={instructorData.image ? URL.createObjectURL(instructorData.image) : assets.upload_area}
                                    alt="Instructor"
                                />
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Upload instructor photo</p>
                            <p className="text-xs text-gray-500">Click to select image</p>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={instructorData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={instructorData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter email address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={instructorData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expertise *
                            </label>
                            <input
                                type="text"
                                name="expertise"
                                value={instructorData.expertise}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Criminal Law, Corporate Law"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience *
                            </label>
                            <input
                                type="text"
                                name="experience"
                                value={instructorData.experience}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 5+ years"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Education *
                            </label>
                            <input
                                type="text"
                                name="education"
                                value={instructorData.education}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., LLB, Harvard Law School"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Consultation Fees *
                            </label>
                            <input
                                type="number"
                                name="fees"
                                value={instructorData.fees}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter fees in USD"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio *
                        </label>
                        <textarea
                            name="bio"
                            value={instructorData.bio}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Brief bio"
                        />
                    </div>

                    {/* About */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            About *
                        </label>
                        <textarea
                            name="about"
                            value={instructorData.about}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Detailed information about the instructor"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding Instructor...
                                </div>
                            ) : (
                                'Add Instructor'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddInstructor
