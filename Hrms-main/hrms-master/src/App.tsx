import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import FinanceDashboard from "./pages/financeDashboard";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setActivePage={setActivePage}
        activePage={activePage}
      />

      <div className="main-area">
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />

        {activePage === "dashboard" && <Dashboard />}
        {activePage === "finance" && <FinanceDashboard />}
      </div>
    </div>
  );
}

export default App;