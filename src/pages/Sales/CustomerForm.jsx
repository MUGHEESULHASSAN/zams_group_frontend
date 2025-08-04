"use client"

import { useState, useEffect } from "react"

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
  })

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    }
  }, [customer])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">Customer Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">Phone</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-group">
        <label htmlFor="company" className="form-label">Company</label>
        <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="form-input" required />
      </div>

      <div className="form-group">
        <label htmlFor="status" className="form-label">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-input">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-gray-200">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {customer ? "Update Customer" : "Add Customer"}
        </button>
      </div>
    </form>
  )
}

export default CustomerForm
