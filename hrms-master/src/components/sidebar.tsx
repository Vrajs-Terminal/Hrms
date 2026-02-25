import "./sidebar.css";
import logo from "../assets/logo2.png";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Settings,
    Users,
    Calculator,
    Activity,
    RefreshCcw,
    Megaphone,
    ClipboardList,
    BarChart2,
    Factory,
    BookOpen,
    Monitor,
    Grid,
    Headphones,
    Building2,
    ChevronRight,
    ChevronDown,
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
}

function Sidebar({ isOpen }: SidebarProps) {
    const companyName = "MineHR-Solutions Pvt. Ltd.";
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        "Company Settings": true
    });

    const toggleMenu = (menuName: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const menuItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        {
            name: "Company Settings",
            icon: Settings,
            subItems: [
                { name: "Company Setup", path: "/company-setup" },
                { name: "Branches", path: "/branches" },
                { name: "Department", path: "/departments" },
            ]
        },
        { name: "Core HRMS", path: "/core-hrms", icon: Users },
        { name: "Finance & Accounting", path: "/finance", icon: Calculator },
        { name: "Productivity & Tracking", path: "/productivity", icon: Activity },
        { name: "CRM", path: "/crm", icon: RefreshCcw },
        { name: "Effective Communication", path: "/communication", icon: Megaphone },
        { name: "Orders & Visits", path: "/orders", icon: ClipboardList },
        { name: "Analytics & Reports", path: "/analytics", icon: BarChart2 },
        { name: "Industry Modules", path: "/industry", icon: Factory },
        { name: "Knowledge Center", path: "/knowledge", icon: BookOpen },
        { name: "Assets & Resources", path: "/assets", icon: Monitor },
        { name: "Other Utilities", path: "/utilities", icon: Grid },
        { name: "Contact Support Team", path: "/support", icon: Headphones },
    ];

    const isActive = (path?: string) => {
        if (!path) return false;
        if (path === "/" && location.pathname !== "/") return false;
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={`sidebar ${!isOpen ? 'sidebar-hidden' : ''}`}>
            <div className="sidebar-content-wrapper">
                {/* Top Section: Logo + User Info */}
                <div className="sidebar-header">
                    <div className="logo-container">
                        <img src={logo} alt="Company Logo" className="sidebar-logo" />
                    </div>

                    <div className="user-profile">
                        <div className="user-detail">
                            <Building2 size={16} className="profile-icon" />
                            <span className="company-text">{companyName}</span>
                        </div>
                    </div>
                </div>

                {/* Menu Section */}
                <nav className="sidebar-menu">
                    <ul>
                        {menuItems.map((item, index) => {
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isMenuOpen = openMenus[item.name];
                            const isItemActive = item.path ? isActive(item.path) : (hasSubItems ? item.subItems?.some(sub => isActive(sub.path)) : false);

                            return (
                                <li key={index} className={`menu-group ${hasSubItems ? 'has-subitems' : ''}`}>
                                    {hasSubItems ? (
                                        <div
                                            className={`menu-item ${isItemActive ? "active" : ""}`}
                                            onClick={() => toggleMenu(item.name)}
                                        >
                                            <div className="menu-item-content">
                                                <item.icon size={18} className="menu-icon" />
                                                <span>{item.name}</span>
                                            </div>
                                            {isMenuOpen ?
                                                <ChevronDown size={16} className="arrow-icon" /> :
                                                <ChevronRight size={16} className="arrow-icon" />
                                            }
                                        </div>
                                    ) : (
                                        <Link to={item.path || "#"} className={`menu-item ${isItemActive ? "active" : ""}`}>
                                            <div className="menu-item-content">
                                                <item.icon size={18} className="menu-icon" />
                                                <span>{item.name}</span>
                                            </div>
                                        </Link>
                                    )}

                                    {/* Sub Items */}
                                    {hasSubItems && isMenuOpen && (
                                        <ul className="sub-menu">
                                            {item.subItems!.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        to={subItem.path}
                                                        className={`sub-menu-item ${isActive(subItem.path) ? "active" : ""}`}
                                                    >
                                                        <div className="sub-menu-dot"></div>
                                                        <span>{subItem.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
