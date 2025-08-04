"use client"

import { useState, useEffect } from "react"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStockItems: 0,
    pendingInvoices: 0,
  })

  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    // Simulate loading dashboard data
    setStats({
      totalSales: 125000,
      totalOrders: 342,
      lowStockItems: 15,
      pendingInvoices: 23,
    })

    setRecentActivities([
      { id: 1, action: "New order created", time: "2 minutes ago", type: "order" },
      { id: 2, action: "Payment received", time: "15 minutes ago", type: "payment" },
      { id: 3, action: "Low stock alert", time: "1 hour ago", type: "alert" },
      { id: 4, action: "New customer registered", time: "2 hours ago", type: "customer" },
    ])
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-base">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-15 h-15 flex items-center justify-center rounded-full bg-blue-50 text-2xl">💰</div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Sales</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">${stats.totalSales.toLocaleString()}</p>
            <span className="text-xs font-medium text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-15 h-15 flex items-center justify-center rounded-full bg-purple-50 text-2xl">📦</div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1 font-medium">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</p>
            <span className="text-xs font-medium text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-15 h-15 flex items-center justify-center rounded-full bg-orange-50 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1 font-medium">Low Stock Items</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.lowStockItems}</p>
            <span className="text-xs font-medium text-red-600">Needs attention</span>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-15 h-15 flex items-center justify-center rounded-full bg-green-50 text-2xl">📄</div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1 font-medium">Pending Invoices</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingInvoices}</p>
            <span className="text-xs font-medium text-yellow-600">Review required</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="flex flex-col gap-2">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`p-3 rounded border-l-4 ${
                activity.type === 'order' ? 'border-blue-500 bg-blue-50' :
                activity.type === 'payment' ? 'border-green-500 bg-green-50' :
                activity.type === 'alert' ? 'border-yellow-500 bg-yellow-50' :
                'border-cyan-500 bg-cyan-50'
              }`}>
                <div>
                  <p className="text-sm text-gray-900 mb-1">{activity.action}</p>
                  <span className="text-xs text-gray-600">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-2">
            <button className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 hover:border-blue-500 transition-colors text-sm text-gray-900">
              <span className="text-base">➕</span>
              New Order
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 hover:border-blue-500 transition-colors text-sm text-gray-900">
              <span className="text-base">👥</span>
              Add Customer
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 hover:border-blue-500 transition-colors text-sm text-gray-900">
              <span className="text-base">📦</span>
              Add Product
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 hover:border-blue-500 transition-colors text-sm text-gray-900">
              <span className="text-base">📊</span>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
