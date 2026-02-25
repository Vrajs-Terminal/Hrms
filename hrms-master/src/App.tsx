import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

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
