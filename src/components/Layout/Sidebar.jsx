"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "../../pages/Inventory/Settings/BrandManagement"
import "../../pages/Inventory/Settings/CategoryManagement"
import "../../pages/Inventory/Settings/ColorManagement"
import "../../pages/Inventory/Settings/TaxCodeManagement"
import "../../pages/Inventory/Settings/UnitTypeManagement"


const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    {
      label: "Sales",
      icon: "💰",
      key: "sales",
      submenu: [
        { path: "/sales", label: "Orders" },
        { path: "/customers", label: "Customers" },
        { path: "/opportunities", label: "Opportunities" },
        { path: "/quotes", label: "Quotes" },
      ],
    },
    { path: "/", label: "Inventory", icon: "📦" ,key:"inventory",
      submenu: [
        { path: "/inventory", label: "Inventory" },
        { path: "/BrandManagement", label: "Brand Management" },
        { path: "/CategoryManagement", label: "Category Management" },
        { path: "/ColorManagement", label: "Color Management" },
        { path: "/TaxCodeManagement", label: "Tax Code Management" },
        { path: "/UnitTypeManagement", label: "Unit Type Management" },
      ],
    },
    {
      label: "Purchasing",
      icon: "🛒",
      key: "purchasing",
      submenu: [
        { path: "/purchasing", label: "Purchase Orders" },
        { path: "/vendors", label: "Vendors" },
        { path: "/receipts", label: "Receipts" },
        { path: "/requisitions", label: "Requisitions" },
      ],
    },
    {
      label: "Human Resources",
      icon: "👥",
      key: "hr",
      submenu: [
        { path: "/hr", label: "Employees" },
        { path: "/departments", label: "Departments" },
        { path: "/leave", label: "Leave Management" },
      ],
    },
    {
      label: "Finance",
      icon: "💳",
      key: "finance",
      submenu: [
        { path: "/finance", label: "Transactions" },
        { path: "/invoices", label: "Invoices" },
      ],
    },
    { path: "/reports", label: "Reports", icon: "📊" },
    { path: "/calendar", label: "Calendar", icon: "📅" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <aside
      className={`fixed left-0 top-15 h-[calc(100vh-3.75rem)] bg-white border-r border-gray-200 transition-transform duration-300 z-40 overflow-y-auto ${
        isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-16"
      }`}
    >
      <div className="py-5">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            {item.submenu ? (
              <>
                <button
                  className={`flex items-center w-full px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm ${
                    isOpen ? "justify-between" : "justify-center"
                  }`}
                  onClick={() => toggleMenu(item.key)}
                >
                  <div className="flex items-center">
                    <span className={`text-base ${isOpen ? "mr-3" : ""}`}>{item.icon}</span>
                    {isOpen && <span className="flex-1 text-left">{item.label}</span>}
                  </div>
                  {isOpen && (
                    <span
                      className={`text-xs transition-transform duration-200 ${
                        expandedMenus[item.key] ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </button>
                {expandedMenus[item.key] && isOpen && (
                  <div className="bg-gray-50 border-l-2 border-blue-500">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`block py-2 px-5 pl-12 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-xs transition-colors ${
                          location.pathname === subItem.path
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                            : ""
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                    : ""
                }`}
              >
                <span className={`text-base ${isOpen ? "mr-3" : ""}`}>{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
