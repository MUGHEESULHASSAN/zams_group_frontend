"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import EmployeeForm from "./EmployeeForm"
import DesignationManagement from "./DesignationManagement"
import PayrollDefinition from "./PayrollDefinition"
import AttendanceRegister from "./AttendanceRegister"
import AttendanceReports from "./AttendanceReports" // Import the new component
import PayrollCalculation from "./PayrollCalculation"

const HumanResources = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [activeTab, setActiveTab] = useState("employees")

  const tabs = [
    { id: "employees", label: "Employees", icon: "👥" },
    { id: "designations", label: "Designations", icon: "🏷️" },
    { id: "payroll", label: "Payroll", icon: "💰" },
    { id: "attendance", label: "Attendance", icon: "📅" },
    { id: "attendance-reports", label: "Reports", icon: "📈" }, // New tab for reports
    { id: "payroll-calculation", label: "Payroll Calculation", icon: "💵" },
  ]

  useEffect(() => {
    const mockEmployees = [
      {
        id: "EMP-001",
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
        department: "Marketing",
        position: "Marketing Manager",
        salary: 75000,
        status: "Active",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "EMP-002",
        name: "Bob Smith",
        email: "bob.smith@company.com",
        department: "IT",
        position: "Software Developer",
        salary: 85000,
        status: "Active",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "EMP-003",
        name: "Carol White",
        email: "carol.white@company.com",
        department: "Sales",
        position: "Sales Executive",
        salary: 60000,
        status: "Active",
        avatar: "", // No avatar for this one
      },
    ]
    setEmployees(mockEmployees)
    setFilteredEmployees(mockEmployees)
  }, [])

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }, [searchTerm, employees])

  const columns = [
    {
      key: "avatar",
      header: "Photo",
      render: (value, row) => (
        <div className="employee-avatar-thumbnail">
          {value ? (
            <img src={value || "/placeholder.svg"} alt={row.name} className="avatar-img" />
          ) : (
            <div className="avatar-placeholder-thumbnail">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
        </div>
      ),
      className: "photo-column",
    },
    { key: "id", header: "Employee ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "position", header: "Position" },
    {
      key: "salary",
      header: "Salary",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp)))
    } else {
      const newEmployee = {
        id: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
        ...employeeData,
      }
      setEmployees([...employees, newEmployee])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-5 py-3 border-0 bg-transparent cursor-pointer text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'text-blue-600 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "employees" && ( // Only show Add Employee button on employees tab
          <button
            className="btn-primary"
            onClick={() => {
              setEditingEmployee(null)
              setIsModalOpen(true)
            }}
          >
            ➕ Add Employee
          </button>
        )}
      </div>
      {activeTab === "employees" && (
        <>
          <div className="page-controls">
            <SearchBar placeholder="Search employees..." value={searchTerm} onChange={setSearchTerm} />
          </div>

          <DataTable
            columns={columns}
            data={filteredEmployees}
            onEdit={(emp) => {
              setEditingEmployee(emp)
              setIsModalOpen(true)
            }}
            onDelete={(emp) => {
              if (window.confirm(`Delete employee ${emp.name}?`)) {
                setEmployees(employees.filter((e) => e.id !== emp.id))
              }
            }}
          />
        </>
      )}
      {activeTab === "designations" && <DesignationManagement />}
      {activeTab === "payroll" && <PayrollDefinition />}
      {activeTab === "attendance" && <AttendanceRegister />}
      {activeTab === "attendance-reports" && <AttendanceReports />} {/* Render new component */}
      {activeTab === "payroll-calculation" && <PayrollCalculation />}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
      >
        <EmployeeForm employee={editingEmployee} onSave={handleSaveEmployee} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default HumanResources
