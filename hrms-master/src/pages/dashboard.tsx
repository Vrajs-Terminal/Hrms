import "./dashboard.css";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    UserCheck,
    Clock,
    UserX,
    CalendarOff,
    FileQuestion,
    MapPinOff,
    LogOut,
    Receipt,
    Shuffle,
    Landmark,
    Smartphone,
    Home,
    History,
    ScanFace,
    UserCog,
    PlusCircle,
    Hourglass,
    FileText
} from 'lucide-react';

const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const trafficData = [
    { name: 'Google', value: 80 },
    { name: 'YouTube', value: 65 },
    { name: 'Instagram', value: 45 },
    { name: 'Pinterest', value: 30 },
    { name: 'Facebook', value: 20 },
    { name: 'Twitter', value: 15 },
];

const deviceData = [
    { name: 'Linux', uv: 4000 },
    { name: 'Mac', uv: 3000 },
    { name: 'iOS', uv: 2000 },
    { name: 'Win', uv: 2780 },
    { name: 'Android', uv: 1890 },
    { name: 'Other', uv: 2390 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Main Content Area */}
            <div className="dashboard-main">
                <div className="dashboard-header">
                    <h2>Overview</h2>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card" style={{ background: '#e3f2fd' }}>
                        <div className="stat-title">Views</div>
                        <div className="stat-value-row">
                            <div className="stat-value">7,265</div>
                            <div className="stat-change positive">+11.01% ↗</div>
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: '#e0f2f1' }}>
                        <div className="stat-title">Visits</div>
                        <div className="stat-value-row">
                            <div className="stat-value">3,671</div>
                            <div className="stat-change negative">-0.03% ↘</div>
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: '#f5f5f5' }}>
                        <div className="stat-title">New Users</div>
                        <div className="stat-value-row">
                            <div className="stat-value">256</div>
                            <div className="stat-change positive">+15.03% ↗</div>
                        </div>
                    </div>
                    <div className="stat-card" style={{ background: '#ede7f6' }}>
                        <div className="stat-title">Active Users</div>
                        <div className="stat-value-row">
                            <div className="stat-value">2,318</div>
                            <div className="stat-change positive">+6.08% ↗</div>
                        </div>
                    </div>
                </div>

                {/* Charts Row 1: Total Users & Traffic source */}
                <div className="charts-row">
                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">Total Users</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>● This year ● Last year</div>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                    <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={0} fill="url(#colorPv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-title">Traffic by Website</div>
                        <div className="traffic-list">
                            {trafficData.map((item, index) => (
                                <div key={index} className="traffic-item">
                                    <div className="traffic-name">{item.name}</div>
                                    <div className="traffic-bar-bg">
                                        <div
                                            className="traffic-bar-fill"
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Charts Row 2: Traffic by Device & Traffic by Location */}
                <div className="charts-row two-equ">
                    <div className="chart-card">
                        <div className="chart-title">Traffic by Device</div>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deviceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="uv" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-title">Traffic by Location</div>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="uv"
                                    >
                                        {data.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Attendance Status */}
            <div className="dashboard-right">
                <div className="section-header">Today Attendance Status & Pending Status</div>
                <div className="attendance-grid">
                    {[
                        { label: "Present", value: "0", icon: UserCheck },
                        { label: "Late In", value: "0", icon: Clock },
                        { label: "Absent", value: "0", icon: UserX },
                        { label: "Full Day Leave", value: "0", icon: CalendarOff },
                        { label: "All Leaves Request", value: "0", icon: FileQuestion },
                        { label: "Attn. Out Of Range", value: "0 (Feb)", icon: MapPinOff },
                        { label: "Punch Out Missing", value: "0 (Feb)", icon: LogOut },
                        { label: "Pending Expenses", value: "0 (Feb)", icon: Receipt },
                        { label: "Shift Change", value: "0", icon: Shuffle },
                        { label: "Bank Change", value: "0", icon: Landmark },
                        { label: "Device Change", value: "0", icon: Smartphone },
                        { label: "WFH Request", value: "0 (Feb)", icon: Home },
                        { label: "Past Attendance", value: "0", icon: History },
                        { label: "Face Change", value: "0", icon: ScanFace },
                        { label: "Profile Change", value: "0", icon: UserCog },
                        { label: "Overtime Request", value: "0 (Feb)", icon: PlusCircle },
                        { label: "Short Leave", value: "0", icon: Hourglass },
                        { label: "Tax Document", value: "0", icon: FileText },
                    ].map((item, index) => (
                        <div key={index} className="attendance-card">
                            <div className="attn-icon-box">
                                <item.icon size={16} />
                            </div>
                            <div className="attn-info">
                                <div className="attn-label">{item.label}</div>
                                <div className="attn-value">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
