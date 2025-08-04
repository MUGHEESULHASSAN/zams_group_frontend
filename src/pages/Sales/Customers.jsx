"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import CustomerForm from "./CustomerForm"

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    // Simulate loading customers data
    const mockCustomers = [
      {
        id: "CUST-001",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1-555-0123",
        company: "ABC Corp",
        status: "Active",
      },
      {
        id: "CUST-002",
        name: "Jane Doe",
        email: "jane.doe@email.com",
        phone: "+1-555-0124",
        company: "XYZ Ltd",
        status: "Active",
      },
      {
        id: "CUST-003",
        name: "Bob Johnson",
        email: "bob.johnson@email.com",
        phone: "+1-555-0125",
        company: "Tech Solutions",
        status: "Inactive",
      },
    ]
    setCustomers(mockCustomers)
    setFilteredCustomers(mockCustomers)
  }, [])

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  const columns = [
    { key: "id", header: "Customer ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "company", header: "Company" },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  const handleNewCustomer = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDeleteCustomer = (customer) => {
    if (window.confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      setCustomers(customers.filter((c) => c.id !== customer.id))
    }
  }

  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      setCustomers(
        customers.map((customer) => (customer.id === editingCustomer.id ? { ...customer, ...customerData } : customer)),
      )
    } else {
      const newCustomer = {
        id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
        ...customerData,
      }
      setCustomers([...customers, newCustomer])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <button className="btn-primary" onClick={handleNewCustomer}>
          ➕ Add Customer
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search customers..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
      >
        <CustomerForm customer={editingCustomer} onSave={handleSaveCustomer} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Customers
