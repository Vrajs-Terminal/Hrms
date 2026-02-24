import "./sidebar.css";
import logo from "../assets/logo2.png";
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
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
}

function Sidebar({ isOpen }: SidebarProps) {
    const companyName = "MineHR-Solutions Pvt. Ltd.";

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, active: true },
        { name: "Setup & Configuration", icon: Settings },
        { name: "Core HRMS", icon: Users },
        { name: "Finance & Accounting", icon: Calculator },
        { name: "Productivity & Tracking", icon: Activity },
        { name: "CRM", icon: RefreshCcw },
        { name: "Effective Communication", icon: Megaphone },
        { name: "Orders & Visits", icon: ClipboardList },
        { name: "Analytics & Reports", icon: BarChart2 },
        { name: "Industry Modules", icon: Factory },
        { name: "Knowledge Center", icon: BookOpen },
        { name: "Assets & Resources", icon: Monitor },
        { name: "Other Utilities", icon: Grid },
        { name: "Contact Support Team", icon: Headphones },
    ];

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
                        {menuItems.map((item, index) => (
                            <li key={index} className={item.active ? "active" : ""}>
                                <div className="menu-item-content">
                                    <item.icon size={18} className="menu-icon" />
                                    <span>{item.name}</span>
                                </div>
                                <ChevronRight size={16} className="arrow-icon" />
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
