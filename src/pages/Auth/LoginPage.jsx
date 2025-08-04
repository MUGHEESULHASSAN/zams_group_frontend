"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // ✅ Allow hardcoded login for testing
    if (username === "abc" && password === "abc") {
      localStorage.setItem("isAuthenticated", "true"); // Fake auth state
      navigate("/"); // Redirect to home
      return;
    }

    // 🔐 Actual login logic
    await login(username, password);
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  } catch (err) {
    setError("Invalid username or password.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl text-gray-900 mb-8 font-semibold">Login to ERP System</h2>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-600 text-sm -mt-2 mb-4">{error}</p>}
          <button type="submit" className="w-full btn-primary py-3 text-base mt-2" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 no-underline font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
