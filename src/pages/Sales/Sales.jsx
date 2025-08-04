"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import OrderForm from "./OrderForm"

const Sales = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)

  useEffect(() => {
    // Simulate loading orders data
    const mockOrders = [
      {
        id: "ORD-001",
        customer: "John Smith",
        date: "2024-01-15",
        total: 1250.0,
        status: "Pending",
        items: 3,
      },
      {
        id: "ORD-002",
        customer: "Jane Doe",
        date: "2024-01-14",
        total: 850.0,
        status: "Completed",
        items: 2,
      },
      {
        id: "ORD-003",
        customer: "Bob Johnson",
        date: "2024-01-13",
        total: 2100.0,
        status: "Processing",
        items: 5,
      },
    ]
    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }, [searchTerm, orders])

  const columns = [
    { key: "id", header: "Order ID" },
    { key: "customer", header: "Customer" },
    { key: "date", header: "Date" },
    { key: "items", header: "Items" },
    {
      key: "total",
      header: "Total",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  const handleNewOrder = () => {
    setEditingOrder(null)
    setIsModalOpen(true)
  }

  const handleEditOrder = (order) => {
    setEditingOrder(order)
    setIsModalOpen(true)
  }

  const handleDeleteOrder = (order) => {
    if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
      setOrders(orders.filter((o) => o.id !== order.id))
    }
  }

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      // Update existing order
      setOrders(orders.map((order) => (order.id === editingOrder.id ? { ...order, ...orderData } : order)))
    } else {
      // Add new order
      const newOrder = {
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        ...orderData,
        date: new Date().toISOString().split("T")[0],
      }
      setOrders([...orders, newOrder])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Sales Orders</h1>
        <button className="btn-primary" onClick={handleNewOrder}>
          ➕ New Order
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search orders..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredOrders} onEdit={handleEditOrder} onDelete={handleDeleteOrder} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrder ? "Edit Order" : "New Order"}
        size="large"
      >
        <OrderForm order={editingOrder} onSave={handleSaveOrder} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Sales
