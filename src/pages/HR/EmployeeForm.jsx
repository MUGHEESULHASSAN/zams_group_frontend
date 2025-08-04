"use client"

import { useState, useEffect } from "react"

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    gender: "",
    fatherName: "",
    address: "",
    cnic: "",
    religion: "",
    email: "",
    contact: "",
    city: "",
    country: "",
    hiringDate: "",
    avatar: "", // New field for employee photo

    // Job Details
    designation: "",
    location: "",
    supervisor: "",
    workingStatus: "Active",
    department: "",
    resignationDate: "",

    // Salary Information
    basicSalary: 0,
    benefits: "",
    grossSalary: 0,

    // Other Information
    attachments: [],
    access: "",
    salesTarget: 0,
    employeeHistory: "",
    area: "",

    // Legacy fields (kept for compatibility with DataTable columns)
    position: "",
    salary: 0,
    status: "Active",
  })

  const [activeSection, setActiveSection] = useState("personal")
  const [attachmentFiles, setAttachmentFiles] = useState([])
  const [avatarPreview, setAvatarPreview] = useState("")

  useEffect(() => {
    if (employee) {
      setFormData({ ...formData, ...employee })
      if (employee.avatar) {
        setAvatarPreview(employee.avatar)
      }
      // Assuming attachments are stored as file objects or URLs,
      // for simplicity, we'll just clear them on edit for now or handle differently.
      // If employee.attachments were URLs, you'd fetch them or handle differently.
      setAttachmentFiles([])
    }
  }, [employee])

  // Auto-calculate gross salary when basic salary or benefits change
  useEffect(() => {
    const benefitsAmount = Number.parseFloat(formData.benefits) || 0
    const grossSalary = formData.basicSalary + benefitsAmount
    setFormData((prev) => ({ ...prev, grossSalary }))
  }, [formData.basicSalary, formData.benefits])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ["name", "email", "contact", "designation", "department"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`)
      return
    }

    // Prepare data for saving
    const saveData = {
      ...formData,
      attachments: attachmentFiles, // This would typically be handled by uploading to storage
      avatar: avatarPreview, // Save the base64 string or URL
      // Sync legacy fields
      position: formData.designation,
      salary: formData.basicSalary,
      status: formData.workingStatus,
    }

    onSave(saveData)
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachmentFiles((prev) => [...prev, ...files])
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        setFormData((prev) => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview("")
      setFormData((prev) => ({ ...prev, avatar: "" }))
    }
  }

  const removeAttachment = (index) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "job", label: "Job Details", icon: "💼" },
    { id: "salary", label: "Salary Info", icon: "💰" },
    { id: "other", label: "Other Info", icon: "📋" },
  ]

  const designations = [
    "Software Engineer",
    "Senior Software Engineer",
    "Team Lead",
    "Project Manager",
    "HR Manager",
    "Marketing Manager",
    "Sales Executive",
    "Accountant",
    "System Administrator",
    "Business Analyst",
    "UI/UX Designer",
    "DevOps Engineer",
  ]

  const departments = [
    "Information Technology",
    "Human Resources",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "Customer Service",
    "Research & Development",
  ]

  const supervisors = [
    "John Smith - Team Lead",
    "Sarah Johnson - Project Manager",
    "Mike Wilson - Senior Manager",
    "Lisa Brown - Department Head",
  ]

  const accessRoles = ["Admin", "Manager", "Employee", "HR", "Finance", "Sales", "Read Only"]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Navigation */}
      <div className="flex gap-1 mb-5 border-b border-gray-200 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`flex items-center gap-2 px-5 py-3 border-0 bg-transparent cursor-pointer text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeSection === section.id 
                ? 'text-blue-600 border-blue-600 bg-blue-50' 
                : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="text-base">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        {activeSection === "personal" && (
          <div className="py-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-blue-500">Personal Information</h3>

            <div className="flex flex-col items-center mb-5">
              <label htmlFor="avatar" className="form-label">Employee Photo</label>
              <div className="w-38 h-38 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 relative border-2 border-gray-300">
                {avatarPreview ? (
                  <img src={avatarPreview || "/placeholder.svg"} alt="Employee Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600 bg-gray-100">
                    {formData.name
                      ? formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "N/A"}
                  </div>
                )}
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label htmlFor="avatar" className="btn-primary text-center inline-block">
                  Upload Photo
                </label>
              </div>
              <small className="text-xs text-gray-500 mt-1">Upload a clear photo of the employee.</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="form-input">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fatherName" className="form-label">Father's Name</label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter father's name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cnic" className="form-label">CNIC</label>
                <input
                  type="text"
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="00000-0000000-0"
                  pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input resize-y"
                rows="3"
                placeholder="Enter complete address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="religion" className="form-label">Religion</label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter religion"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hiringDate" className="form-label">Hiring Date</label>
                <input
                  type="date"
                  id="hiringDate"
                  name="hiringDate"
                  value={formData.hiringDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact" className="form-label">Contact Number *</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
          </div>
        )}

        {/* Job Details Section */}
        {activeSection === "job" && (
          <div className="py-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-blue-500">Job Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="designation" className="form-label">Designation *</label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="department" className="form-label">Department *</label>
                <select id="department" name="department" value={formData.department} onChange={handleChange} className="form-input" required>
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Work location"
                />
              </div>

              <div className="form-group">
                <label htmlFor="area" className="form-label">Area</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Work area/region"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="supervisor" className="form-label">Supervisor</label>
                <select id="supervisor" name="supervisor" value={formData.supervisor} onChange={handleChange} className="form-input">
                  <option value="">Select Supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor} value={supervisor}>
                      {supervisor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="workingStatus" className="form-label">Working Status</label>
                <select id="workingStatus" name="workingStatus" value={formData.workingStatus} onChange={handleChange} className="form-input">
                  <option value="Active">Active</option>
                  <option value="Resigned">Resigned</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            {formData.workingStatus === "Resigned" && (
              <div className="form-group">
                <label htmlFor="resignationDate" className="form-label">Resignation Date</label>
                <input
                  type="date"
                  id="resignationDate"
                  name="resignationDate"
                  value={formData.resignationDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}
          </div>
        )}

        {/* Salary Information Section */}
        {activeSection === "salary" && (
          <div className="py-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-blue-500">Salary Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="basicSalary" className="form-label">Basic Salary</label>
                <input
                  type="number"
                  id="basicSalary"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="benefits" className="form-label">Benefits/Allowances</label>
                <input
                  type="number"
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="grossSalary" className="form-label">Gross Salary</label>
                <input
                  type="number"
                  id="grossSalary"
                  name="grossSalary"
                  value={formData.grossSalary}
                  onChange={handleChange}
                  className="form-input bg-gray-50 text-gray-600 cursor-not-allowed"
                  min="0"
                  step="0.01"
                  placeholder="Auto-calculated"
                />
                <small className="text-xs text-gray-500 mt-1">Auto-calculated from Basic Salary + Benefits</small>
              </div>

              <div className="form-group">
                <label htmlFor="salesTarget" className="form-label">Sales Target</label>
                <input
                  type="number"
                  id="salesTarget"
                  name="salesTarget"
                  value={formData.salesTarget}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}

        {/* Other Information Section */}
        {activeSection === "other" && (
          <div className="py-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-2 border-b-2 border-blue-500">Other Information</h3>

            <div className="form-group">
              <label htmlFor="access" className="form-label">Access Level/Role</label>
              <select id="access" name="access" value={formData.access} onChange={handleChange} className="form-input">
                <option value="">Select Access Level</option>
                {accessRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="employeeHistory" className="form-label">Employee History</label>
              <textarea
                id="employeeHistory"
                name="employeeHistory"
                value={formData.employeeHistory}
                onChange={handleChange}
                className="form-input resize-y"
                rows="4"
                placeholder="Enter employee history, previous positions, achievements, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachments" className="form-label">Attachments</label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="form-input border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              />
              <small className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)</small>

              {attachmentFiles.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="mb-2 text-sm text-gray-900">Attached Files:</h4>
                  {attachmentFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded mb-1">
                      <span className="flex-1 text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-600">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button type="button" className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors" onClick={() => removeAttachment(index)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-gray-200">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {employee ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmployeeForm
