import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="main-area">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
