import "./sidebar.css";
import logo from "../assets/logo2.png";
import { useState, useEffect } from "react";
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
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

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
                { name: "Sister Companies", path: "/sister-companies" },
                { name: "Roles & Privileges", path: "/admin-rights" },
                { name: "Admin Menu Reordering", path: "/admin-menu-reordering" },
                // Add a visual separator if needed via CSS, but per request, just align better
                { name: "Zones", path: "/zones" },
                { name: "Branches", path: "/branches" },
                { name: "Departments", path: "/departments" },
                { name: "Sub-Departments", path: "/sub-departments" },
                { name: "Designations", path: "/designations" },

                { name: "Employee Levels", path: "/employee-levels" },
                { name: "Employee Grades", path: "/employee-grades" },
                { name: "Assign Employee Grade", path: "/assign-employee-grade" },
                { name: "ID Card Templates", path: "/id-card-templates" },
                { name: "Employee Parking Area", path: "/employee-parking" },

                { name: "Emergency Numbers", path: "/emergency-numbers" },
                { name: "Manage WhatsApp Alerts", path: "/whatsapp-alerts" },
                { name: "Daily Attendance Email", path: "/daily-attendance-email" },
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

    const [dynamicMenuItems, setDynamicMenuItems] = useState(menuItems);

    useEffect(() => {
        const fetchMenuOrder = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/settings/ADMIN_MENU_ORDER');
                if (res.ok) {
                    const data = await res.json();
                    // The saved shape is: { id, name, iconName, order }
                    if (data && data.value && Array.isArray(data.value)) {
                        const orderData: { id: string; name: string; iconName: string; order: number }[] = data.value;

                        // Sort by the saved order field
                        const sorted = [...orderData].sort((a, b) => a.order - b.order);

                        // Map saved names back to local menu items (which have icons already)
                        const newOrderedList = sorted
                            .map(savedItem => menuItems.find(m => m.name === savedItem.name))
                            .filter((m): m is typeof menuItems[0] => Boolean(m));

                        // Append any local items not found in the saved order (future-proofing)
                        menuItems.forEach(localItem => {
                            if (!newOrderedList.find(om => om.name === localItem.name)) {
                                newOrderedList.push(localItem);
                            }
                        });

                        setDynamicMenuItems(newOrderedList);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch menu order', err);
            }
        };

        fetchMenuOrder();

        // Listen for real-time updates when admin saves menu order on the same tab
        window.addEventListener('menuOrderChanged', fetchMenuOrder);

        return () => {
            window.removeEventListener('menuOrderChanged', fetchMenuOrder);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        {dynamicMenuItems.map((item, index) => {
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isMenuOpen = openMenus[item.name];

                            // Check if current path matches any subitem
                            let isItemActive = false;
                            if (item.path) {
                                isItemActive = isActive(item.path);
                            } else if (hasSubItems) {
                                isItemActive = item.subItems?.some(sub => isActive(sub.path)) || false;
                            }

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

                                    {/* Flat Sub Items */}
                                    {hasSubItems && isMenuOpen && (
                                        <ul className="sub-menu">
                                            {item.subItems!.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        to={subItem.path || "#"}
                                                        className={`sub-menu-item ${isActive(subItem.path) ? "active" : ""}`}
                                                    >
                                                        <div className="sub-menu-dot"></div>
                                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {subItem.name}
                                                        </span>
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
