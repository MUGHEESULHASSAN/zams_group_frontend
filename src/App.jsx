import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext" // Import AuthProvider
import PrivateRoute from "./components/Auth/PrivateRoute" // Import PrivateRoute
import Layout from "./components/Layout/Layout"
import Dashboard from "./pages/Dashboard/Dashboard"
import Sales from "./pages/Sales/Sales"
import Customers from "./pages/Sales/Customers"
import Opportunities from "./pages/Sales/Opportunities"
import Quotes from "./pages/Sales/Quotes"
import Inventory from "./pages/Inventory/Inventory"
import Purchasing from "./pages/Purchasing/Purchasing"
import Vendors from "./pages/Purchasing/Vendors"
import Receipts from "./pages/Purchasing/Receipts"
import Requisitions from "./pages/Purchasing/Requisitions"
import HumanResources from "./pages/HR/HumanResources"
import Departments from "./pages/HR/Departments"
import LeaveManagement from "./pages/HR/LeaveManagement"
import Finance from "./pages/Finance/Finance"
import Invoices from "./pages/Finance/Invoices"
import Reports from "./pages/Reports/Reports"
import Calendar from "./pages/Calendar/Calendar"
import Settings from "./pages/Settings/Settings"
import Profile from "./pages/Settings/Profile"
import Company from "./pages/Settings/Company"
import LoginPage from "./pages/Auth/LoginPage" // Import LoginPage
import RegisterPage from "./pages/Auth/RegisterPage" // Import RegisterPage
import AttendanceReports from "./pages/HR/AttendanceReports" // Import new AttendanceReports
import PayrollCalculation from "./pages/HR/PayrollCalculation"
import BrandManagement from "./pages/Inventory/Settings/BrandManagement"
import CategoryManagement from "./pages/Inventory/Settings/CategoryManagement"
import ColorManagement from "./pages/Inventory/Settings/ColorManagement"
import TaxCodeManagement from "./pages/Inventory/Settings/TaxCodeManagement"
import UnitTypeManagement from "./pages/Inventory/Settings/UnitTypeManagement"
import "./index.css"; // Import your main CSS file


function App() {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wrap the entire application with AuthProvider */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/quotes" element={<Quotes />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/purchasing" element={<Purchasing />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/receipts" element={<Receipts />} />
                    <Route path="/requisitions" element={<Requisitions />} />
                    <Route path="/hr" element={<HumanResources />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/leave" element={<LeaveManagement />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/company" element={<Company />} />
                    <Route path="/BrandManagement" element={<BrandManagement />} />
                    <Route path="/CategoryManagement" element={<CategoryManagement />} />
                    <Route path="/ColorManagement" element={<ColorManagement />} />
                    <Route path="/TaxCodeManagement" element={<TaxCodeManagement />} />
                    <Route path="/UnitTypeManagement" element={<UnitTypeManagement />} />
                    <Route path="/hr/attendance-reports" element={<AttendanceReports />} />{" "}
                    {/* New route for attendance reports */}
                    <Route path="/hr/payroll-calculation" element={<PayrollCalculation />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
