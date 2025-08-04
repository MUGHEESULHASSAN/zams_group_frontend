"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const RegisterPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      const result = await register(username, email, password)
      setSuccess(result.message)
      setTimeout(() => {
        navigate("/login") // Redirect to login after successful registration
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl text-gray-900 mb-8 font-semibold">Register for ERP System</h2>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="form-group">
            <label htmlFor="reg-username" className="form-label">Username</label>
            <input
              type="text"
              id="reg-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <input
              type="email"
              id="reg-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input
              type="password"
              id="reg-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-600 text-sm -mt-2 mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm -mt-2 mb-4">{success}</p>}
          <button type="submit" className="w-full btn-primary py-3 text-base mt-2" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 no-underline font-medium hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
