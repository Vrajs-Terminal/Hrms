import { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import CompanySetup from "./pages/company-setup";
import Branches from "./pages/branches";
import Departments from "./pages/departments";
import Zones from "./pages/zones";
import SubDepartments from "./pages/sub-departments";
import Designations from "./pages/designations";
import SisterCompanies from "./pages/sister-companies";
import EmployeeLevels from "./pages/employee-levels";
import EmployeeGrades from "./pages/employee-grades";
import AdminRights from "./pages/admin-rights";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Login />
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="main-area">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="content-area" style={{ overflow: 'auto', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/company-setup" element={<CompanySetup />} />
              <Route path="/sister-companies" element={<SisterCompanies />} />
              <Route path="/employee-levels" element={<EmployeeLevels />} />
              <Route path="/employee-grades" element={<EmployeeGrades />} />
              <Route path="/admin-rights" element={<AdminRights />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/sub-departments" element={<SubDepartments />} />
              <Route path="/designations" element={<Designations />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
