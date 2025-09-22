import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
    const { dashboardData, getDashboardData, loading } = useContext(AppContext)

    useEffect(() => {
        getDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const StatCard = ({ title, count, icon, color = "blue" }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{count || 0}</p>
                </div>
                <div className={`bg-${color}-100 p-3 rounded-full`}>
                    <img src={icon} alt="" className="w-6 h-6" />
                </div>
            </div>
        </div>
    )

    return (
        <div className="m-5 w-full max-w-6xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Instructors"
                    count={dashboardData?.instructors}
                    icon={assets.people_icon}
                />
                
                <StatCard
                    title="Total Students"
                    count={dashboardData?.users}
                    icon={assets.patient_icon}
                />
                
                <StatCard
                    title="Total Consultations"
                    count={dashboardData?.appointments}
                    icon={assets.appointment_icon}
                />
                
                <StatCard
                    title="Total Earnings"
                    count={`$${dashboardData?.earnings || 0}`}
                    icon={assets.earning_icon}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                        {dashboardData?.recentActivity?.length > 0 ? (
                            dashboardData.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <p className="text-sm text-gray-700">{activity}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No recent activity</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">System Status</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                            <span className="text-sm font-medium text-gray-700">System Status</span>
                            <span className="text-sm text-green-600 font-semibold">Online</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                            <span className="text-sm font-medium text-gray-700">Database</span>
                            <span className="text-sm text-blue-600 font-semibold">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">Last Updated</span>
                            <span className="text-sm text-gray-600">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
