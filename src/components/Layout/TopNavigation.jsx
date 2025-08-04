"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NotificationDropdown from "../Dropdowns/NotificationDropdown"
import ProfileDropdown from "../Dropdowns/ProfileDropdown"
import { useAuth } from "../../context/AuthContext" // Import useAuth

const TopNavigation = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const { user } = useAuth() // Get user from AuthContext
  const [notifications] = useState([
    { id: 1, message: "New order received", time: "5 min ago", type: "info" },
    { id: 2, message: "Low stock alert: Product A", time: "10 min ago", type: "warning" },
    { id: 3, message: "Payment received", time: "1 hour ago", type: "success" },
  ])

  const handleRefreshData = () => {
    // Simulate data refresh
    window.location.reload()
  }

  const handleAnalyticsReports = () => {
    navigate("/reports")
  }

  return (
    <nav className="flex justify-between items-center px-5 h-15 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex items-center gap-4">
        {user && ( // Only show menu toggle if user is logged in
          <button 
            className="md:hidden p-1 hover:bg-gray-100 rounded-md transition-colors"
            onClick={toggleSidebar}
          >
            <div className="w-5 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-800"></div>
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">ERP System</h1>
      </div>

      <div className="flex items-center gap-2">
        {user ? ( // Conditionally render based on authentication status
          <>
            <button 
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={handleRefreshData} 
              title="Refresh Data"
            >
              <span className="text-lg">🔄</span>
            </button>

            <button 
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={handleAnalyticsReports} 
              title="Analytics Reports"
            >
              <span className="text-lg">📊</span>
            </button>

            <NotificationDropdown notifications={notifications} />
            <ProfileDropdown />
          </>
        ) : (
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn-secondary" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default TopNavigation
