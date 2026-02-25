import "./header.css";
import { useState, useEffect, useRef } from "react";
import { Search, Bell, User, PanelLeftClose, LogOut, Settings, Keyboard } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
    const [placeholderText, setPlaceholderText] = useState("Search services...");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { username, logout } = useAuthStore();

    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const services = [
            "Search Employees...",
            "Search Payroll...",
            "Search Recruitment...",
            "Search Performance..."
        ];

        let index = 0;
        const intervalId = setInterval(() => {
            setPlaceholderText(services[index]);
            index = (index + 1) % services.length;
        }, 2000);

        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
            {/* Search Bar - Rotates services */}
            <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder={placeholderText}
                    className="search-input"
                />
            </div>

            <div className="header-spacer"></div>

            {/* Notification Menu */}
            <div className="notifications-wrapper" ref={notifRef}>
                <div
                    className="notifications"
                    onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowProfileMenu(false);
                    }}
                >
                    <Bell size={20} className="bell-icon" />
                    <div className="notification-dot" />
                </div>

                {showNotifications && (
                    <div className="dropdown-menu notifications-dropdown">
                        <div className="dropdown-header">
                            <h4>Notifications</h4>
                            <span className="badge">1 New</span>
                        </div>
                        <div className="dropdown-content">
                            <div className="dropdown-item notif-item unread">
                                <div className="notif-icon bg-blue"><Bell size={16} /></div>
                                <div className="notif-text">
                                    <p>System update completed successfully</p>
                                    <span>2 mins ago</span>
                                </div>
                            </div>
                            <div className="dropdown-item notif-item">
                                <div className="notif-icon bg-green"><User size={16} /></div>
                                <div className="notif-text">
                                    <p>New login from recognized device</p>
                                    <span>1 hour ago</span>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown-footer">
                            <button>View all notifications</button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Profile - Rightmost */}
            <div className="user-profile-wrapper" ref={profileRef}>
                <div
                    className="user-profile-header"
                    onClick={() => {
                        setShowProfileMenu(!showProfileMenu);
                        setShowNotifications(false);
                    }}
                >
                    <span className="header-user-name">{username || "User Name"}</span>
                    <div className="user-avatar-header premium-navy">
                        <User size={20} />
                    </div>
                </div>

                {showProfileMenu && (
                    <div className="dropdown-menu profile-dropdown">
                        <div className="dropdown-header profile-header-info">
                            <p className="ph-name">{username || "User Name"}</p>
                            <p className="ph-email">admin@minehr.com</p>
                        </div>
                        <div className="dropdown-content">
                            <button className="dropdown-item">
                                <User size={18} />
                                <span>My Profile</span>
                            </button>
                            <button className="dropdown-item">
                                <Settings size={18} />
                                <span>Account Settings</span>
                            </button>
                            <button className="dropdown-item">
                                <Keyboard size={18} />
                                <span>Keyboard Shortcuts</span>
                            </button>

                            <div className="dropdown-divider"></div>

                            <button className="dropdown-item logout-action" onClick={logout}>
                                <LogOut size={18} />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
