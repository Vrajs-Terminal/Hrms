import "./header.css";
import { useState, useEffect } from "react";
import { Search, Bell, User, PanelLeftClose } from "lucide-react";

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
    const [placeholderText, setPlaceholderText] = useState("Search services...");
    const services = [
        "Search Employees...",
        "Search Payroll...",
        "Search Recruitment...",
        "Search Performance..."
    ];

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setPlaceholderText(services[index]);
            index = (index + 1) % services.length;
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="header">
            {/* Left: Sidebar Toggle Button */}
            <button
                className={`menu-toggle-btn ${!isSidebarOpen ? 'closed' : ''}`}
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
            >
                <PanelLeftClose
                    size={24}
                    className={`menu-icon-btn ${!isSidebarOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div className="header-spacer"></div>
            {/* Search Bar - Rotates services */}
            <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder={placeholderText}
                    className="search-input"
                />
            </div>

            {/* Notification Menu */}
            <div className="notifications">
                <Bell size={20} className="bell-icon" />
                <div className="notification-dot" />
            </div>

            {/* User Profile - Rightmost */}
            <div className="user-profile-header">
                <span className="header-user-name">User Name</span>
                <div className="user-avatar-header premium-navy">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
}

export default Header;
