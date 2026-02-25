import { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import CompanySetup from "./pages/company-setup";
import Branches from "./pages/branches";
import Departments from "./pages/departments";
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
              <Route path="/branches" element={<Branches />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
