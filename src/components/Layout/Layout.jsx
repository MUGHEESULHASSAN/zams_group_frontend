"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import TopNavigation from "./TopNavigation"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`flex-1 p-5 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
