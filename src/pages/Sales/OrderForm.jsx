"use client"

import { useState, useEffect } from "react"

const OrderForm = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: "",
    total: 0,
    status: "Pending",
    items: 1,
  })

  useEffect(() => {
    if (order) {
      setFormData(order)
    }
  }, [order])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total" || name === "items" ? Number(value) : value,
    }))
  }

  return (
    <form className="max-w-lg" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="customer" className="form-label">Customer Name</label>
        <input type="text" id="customer" name="customer" value={formData.customer} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="items" className="form-label">Number of Items</label>
          <input
            type="number"
            id="items"
            name="items"
            value={formData.items}
            onChange={handleChange}
            className="form-input"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="total" className="form-label">Total Amount</label>
          <input
            type="number"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            className="form-input"
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status" className="form-label">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-input">
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-gray-200">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {order ? "Update Order" : "Create Order"}
        </button>
      </div>
    </form>
  )
}

export default OrderForm
