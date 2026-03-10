import "./sidebar.css";
import meshBg from "../assets/image-mesh-gradient.png";
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
    FileText,
    BarChart2,
    Factory,
    BookOpen,
    Monitor,
    Grid,
    Headphones,
    Building2,
    ChevronRight,
    ChevronDown,
    MapPin,
    Map,
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
        {
            name: "Attendance",
            icon: ClipboardList,
            subItems: [
                { name: "Attendance Dashboard", path: "/attendance-dashboard" },
                { name: "View Attendance", path: "/view-attendance" },
                { name: "Add Attendance", path: "/add-attendance" },
                { name: "Month Wise Attendances", path: "/month-wise-attendance" },
                { name: "Weekly Attendance", path: "/weekly-attendance" },
                { name: "Pending Attendance", path: "/pending-attendance" },
                { name: "Punch Out Missing Request", path: "/punch-out-missing-request" },
                { name: "Punch Out Missing Approval", path: "/punch-out-missing-approval" },
                { name: "Previous Date Attendance Request", path: "/previous-date-attendance" },
                { name: "Update Attendance", path: "/update-attendance" },
                { name: "Update Break", path: "/update-break" },
                { name: "Week Off Exchange Request", path: "/week-off-exchange" },
                { name: "Week Off Approval", path: "/week-off-approval" },
                { name: "Absent Employees", path: "/absent-employees" },
                { name: "Add Bulk Attendance", path: "/add-bulk-attendance" },
                { name: "Pending Break", path: "/pending-break" },
                { name: "Break Approval Request", path: "/break-approval" },
                { name: "Overtime Request", path: "/overtime-request" },
                { name: "Overtime Approval", path: "/overtime-approval" },
                { name: "Delete Attendance", path: "/delete-attendance" },
                { name: "Attendance Modification Request", path: "/attendance-modification" },
                { name: "Recalculate Attendance", path: "/recalculate-attendance" },
                { name: "Pending Flags", path: "/pending-flags" },
            ]
        },
        {
            name: "Employee Tracking",
            icon: MapPin,
            subItems: [
                { name: "Tracking Dashboard", path: "/tracking-dashboard" },
                { name: "Employee Live Tracking", path: "/employee-live-tracking" },
                { name: "Tracking History", path: "/tracking-history" },
                { name: "Geo-Fence Settings", path: "/geofence-settings" },
                { name: "Exception Management", path: "/exception-management" },
                { name: "Tracking Reports", path: "/tracking-reports" },
                { name: "Tracking Employee Wise", path: "/tracking-employee-wise" },
            ]
        },
        {
            name: "Visit Management",
            icon: Map,
            subItems: [
                { name: "Visit Dashboard", path: "/visit-dashboard" },
                { name: "Visit Planning", path: "/visit-planning" },
                { name: "Check-In / Out", path: "/visit-check-in-out" },
                { name: "Visit Approvals", path: "/visit-approvals" },
                { name: "Visit Settings", path: "/visit-settings" },
            ]
        },
        {
            name: "Daily Work Report",
            path: "/daily-work-report",
            icon: FileText
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
                const res = await fetch('/api/settings/ADMIN_MENU_ORDER');
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
                                if (localItem.name === "Attendance") {
                                    newOrderedList.splice(2, 0, localItem);
                                } else if (localItem.name === "Employee Tracking") {
                                    newOrderedList.splice(3, 0, localItem);
                                } else {
                                    newOrderedList.push(localItem);
                                }
                            }
                        });

                        // Force "Attendance" to definitively reside at pos 3
                        const attendanceIndex = newOrderedList.findIndex(m => m.name === "Attendance");
                        if (attendanceIndex !== -1 && attendanceIndex !== 2) {
                            const [attendanceItem] = newOrderedList.splice(attendanceIndex, 1);
                            newOrderedList.splice(2, 0, attendanceItem);
                        }

                        // Force "Employee Tracking" to definitively reside at pos 4
                        const trackingIndex = newOrderedList.findIndex(m => m.name === "Employee Tracking");
                        if (trackingIndex !== -1 && trackingIndex !== 3) {
                            const [trackingItem] = newOrderedList.splice(trackingIndex, 1);
                            newOrderedList.splice(3, 0, trackingItem);
                        }

                        // Force "Daily Work Report" to definitively reside at pos 5
                        const dwrIndex = newOrderedList.findIndex(m => m.name === "Daily Work Report");
                        if (dwrIndex !== -1 && dwrIndex !== 4) {
                            const [dwrItem] = newOrderedList.splice(dwrIndex, 1);
                            newOrderedList.splice(4, 0, dwrItem);
                        }

                        // Force "Visit Management" right after Employee Tracking
                        const visitIndex = newOrderedList.findIndex(m => m.name === "Visit Management");
                        if (visitIndex !== -1 && visitIndex !== 5) {
                            const [visitItem] = newOrderedList.splice(visitIndex, 1);
                            newOrderedList.splice(5, 0, visitItem);
                        }

                        // Fallback: Ensure critical modules are present
                        if (!newOrderedList.find(m => m.name === "Employee Tracking")) {
                            const item = menuItems.find(m => m.name === "Employee Tracking");
                            if (item) newOrderedList.splice(3, 0, item);
                        }
                        if (!newOrderedList.find(m => m.name === "Daily Work Report")) {
                            const item = menuItems.find(m => m.name === "Daily Work Report");
                            if (item) newOrderedList.splice(4, 0, item);
                        }
                        if (!newOrderedList.find(m => m.name === "Visit Management")) {
                            const item = menuItems.find(m => m.name === "Visit Management");
                            if (item) newOrderedList.splice(5, 0, item);
                        }

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

    }, []);

    const isActive = (path?: string) => {
        if (!path) return false;
        if (path === "/" && location.pathname !== "/") return false;
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={`sidebar ${!isOpen ? 'sidebar-hidden' : ''}`} style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.666), rgba(15, 23, 42, 0.6)), url(${meshBg})` }}>
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
                                                        <span style={{ whiteSpace: 'normal', paddingRight: '12px' }}>
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
