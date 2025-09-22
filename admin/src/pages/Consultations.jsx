import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const Consultations = () => {
    const { 
        consultations, 
        getConsultations, 
        updateConsultationStatus, 
        userType,
        loading 
    } = useContext(AppContext)

    useEffect(() => {
        getConsultations()
    }, [])

    const handleStatusUpdate = (consultationId, status) => {
        updateConsultationStatus(consultationId, status)
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="m-5 w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {userType === 'admin' ? 'All Consultations' : 'My Consultations'}
                </h1>
                <p className="text-sm text-gray-600">Total: {consultations.length} consultations</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {consultations.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No consultations found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    {userType === 'admin' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Instructor
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fees
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {consultations.map((consultation, index) => (
                                    <tr key={consultation._id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {consultation.userName?.charAt(0) || consultation.student?.name?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {consultation.userName || consultation.student?.name || 'Unknown Student'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {consultation.userEmail || consultation.student?.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {userType === 'admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {consultation.instructorName || consultation.instructor?.name || 'Unknown Instructor'}
                                                </div>
                                            </td>
                                        )}
                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {consultation.slotDate && consultation.slotTime 
                                                    ? `${consultation.slotDate} at ${consultation.slotTime}`
                                                    : consultation.date 
                                                    ? new Date(consultation.date).toLocaleString()
                                                    : 'No date set'
                                                }
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                ${consultation.amount || consultation.fees || 'N/A'}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                                                {consultation.status || 'Pending'}
                                            </span>
                                        </td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {consultation.status !== 'completed' && consultation.status !== 'cancelled' && (
                                                <>
                                                    {userType === 'instructor' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(consultation._id, 'completed')}
                                                            className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleStatusUpdate(consultation._id, 'cancelled')}
                                                        className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {(consultation.status === 'completed' || consultation.status === 'cancelled') && (
                                                <span className="text-xs text-gray-500">No actions available</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Consultations
