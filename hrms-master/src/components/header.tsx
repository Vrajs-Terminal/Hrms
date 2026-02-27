import "./header.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Bell, User, PanelLeftClose, LogOut, Settings, Keyboard, Plus, Pencil, Trash2, RefreshCw, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/axios";

interface Notification {
    id: number;
    action: string;
    entity_type: string;
    entity_name: string;
    details?: string | null;
    createdAt: string;
    user?: { id: number; name: string; email: string } | null;
}

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
    const [placeholderText, setPlaceholderText] = useState("Search services...");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notifCount, setNotifCount] = useState(0);
    const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = useCallback(async (limit = 5) => {
        setIsLoadingNotifs(true);
        try {
            const res = await api.get(`/notifications?limit=${limit}`);
            setNotifications(res.data);
            setNotifCount(res.data.length);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setIsLoadingNotifs(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(5);
        const interval = setInterval(() => fetchNotifications(5), 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

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
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATED': return <Plus size={14} />;
            case 'UPDATED': return <Pencil size={14} />;
            case 'DELETED': return <Trash2 size={14} />;
            default: return <Bell size={14} />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATED': return 'notif-action-created';
            case 'UPDATED': return 'notif-action-updated';
            case 'DELETED': return 'notif-action-deleted';
            default: return 'notif-action-default';
        }
    };

    const formatEntityType = (type: string) => {
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const handleBellClick = () => {
        const opening = !showNotifications;
        setShowNotifications(opening);
        setShowProfileMenu(false);
        if (opening) {
            setIsExpanded(false);
            fetchNotifications(5);
        }
    };

    const handleViewAll = () => {
        setIsExpanded(true);
        fetchNotifications(100);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        fetchNotifications(5);
    };

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
                    onClick={handleBellClick}
                >
                    <Bell size={20} className="bell-icon" />
                    {notifCount > 0 && <div className="notification-dot" />}
                </div>

                {showNotifications && (
                    <div className={`dropdown-menu notifications-dropdown ${isExpanded ? 'notif-expanded' : ''}`}>
                        <div className="dropdown-header">
                            <h4>Notifications</h4>
                            <div className="notif-header-actions">
                                {notifCount > 0 && <span className="badge">{notifCount} Recent</span>}
                                <button
                                    className="notif-refresh-btn"
                                    onClick={(e) => { e.stopPropagation(); fetchNotifications(isExpanded ? 100 : 5); }}
                                    title="Refresh"
                                >
                                    <RefreshCw size={14} className={isLoadingNotifs ? 'spin' : ''} />
                                </button>
                            </div>
                        </div>

                        <div className="dropdown-content notif-scroll-area">
                            {notifications.length === 0 ? (
                                <div className="notif-empty">
                                    <Bell size={28} style={{ color: '#cbd5e1', marginBottom: 8 }} />
                                    <p>No activity yet</p>
                                    <span>Changes will appear here</span>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div key={notif.id} className="dropdown-item notif-item">
                                        <div className={`notif-icon ${getActionColor(notif.action)}`}>
                                            {getActionIcon(notif.action)}
                                        </div>
                                        <div className="notif-text">
                                            <p>
                                                <strong>{notif.action.toLowerCase()}</strong>{' '}
                                                {formatEntityType(notif.entity_type)}{' '}
                                                <span className="notif-entity-name">"{notif.entity_name}"</span>
                                            </p>
                                            <span className="notif-meta">
                                                {notif.user?.name && <>{notif.user.name} · </>}
                                                {timeAgo(notif.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="dropdown-footer notif-footer">
                            {!isExpanded ? (
                                <button onClick={handleViewAll}>
                                    View all notifications
                                </button>
                            ) : (
                                <button onClick={handleCollapse} className="notif-collapse-btn">
                                    <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} />
                                    <span>Show less</span>
                                </button>
                            )}
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
                        setIsExpanded(false);
                    }}
                >
                    <span className="header-user-name">{user?.name || "User Name"}</span>
                    <div className="user-avatar-header premium-navy">
                        <User size={20} />
                    </div>
                </div>

                {showProfileMenu && (
                    <div className="dropdown-menu profile-dropdown">
                        <div className="dropdown-header profile-header-info">
                            <p className="ph-name">{user?.name || "User Name"}</p>
                            <p className="ph-email">{user?.email || "employee@minehr.com"}</p>
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
