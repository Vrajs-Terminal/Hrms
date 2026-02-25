import "./dashboard.css";
import {
    XAxis,
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
    UserCheck, Clock, UserX, CalendarOff, FileQuestion, MapPinOff, LogOut,
    Receipt, Shuffle, Landmark, Smartphone, Home, History, ScanFace, UserCog,
    PlusCircle, Hourglass, FileText, Users, Briefcase, IndianRupee, ArrowUpRight,
    CheckCircle2, Plus, FileBarChart, Building, Layers
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/axios';

const hiringData = [
    { name: 'Jan', new: 80, exit: -25 },
    { name: 'Feb', new: 110, exit: -35 },
    { name: 'Mar', new: 70, exit: -40 },
    { name: 'Apr', new: 130, exit: -15 },
    { name: 'May', new: 90, exit: -20 },
    { name: 'Jun', new: 120, exit: -30 },
    { name: 'Jul', new: 140, exit: -10 },
    { name: 'Aug', new: 100, exit: -45 },
];

const deptData = [
    { name: 'Engineering', value: 35 },
    { name: 'Sales', value: 25 },
    { name: 'HR & Admin', value: 20 },
    { name: 'Marketing', value: 12 },
    { name: 'Others', value: 8 },
];
const DEPT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

const recentEmployees = [
    { id: '1', name: 'Rohit Sharma', role: 'Frontend Dev', dept: 'Engineering', status: 'Active', statusColor: '#10b981', avatarColor: '#3b82f6', initials: 'RS' },
    { id: '2', name: 'Priya Kumar', role: 'HR Manager', dept: 'HR & Admin', status: 'Remote', statusColor: '#3b82f6', avatarColor: '#10b981', initials: 'PK' },
    { id: '3', name: 'Arjun Mehta', role: 'Sales Lead', dept: 'Sales', status: 'On Leave', statusColor: '#f59e0b', avatarColor: '#f59e0b', initials: 'AM' },
    { id: '4', name: 'Sneha Gupta', role: 'UX/UI Designer', dept: 'Marketing', status: 'Active', statusColor: '#10b981', avatarColor: '#ef4444', initials: 'SG' },
    { id: '5', name: 'Vikram Rao', role: 'Backend Dev', dept: 'Engineering', status: 'Active', statusColor: '#10b981', avatarColor: '#8b5cf6', initials: 'VR' },
];

function Dashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            {/* Main Content Area */}
            <div className="dashboard-main">
                {/* Dashboard Header */}
                <div className="dashboard-header-title">
                    <div>
                        <h1>Dashboard Overview</h1>
                        <p>Welcome back! Here is what's happening today across your organization.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="main-stats-grid">
                    <div className="new-stat-card">
                        <div className="ns-header">
                            <div className="ns-icon ns-blue"><Users size={16} /></div>
                            <div className="ns-change positive"><ArrowUpRight size={12} strokeWidth={3} /> Active</div>
                        </div>
                        <div className="ns-body">
                            <div className="ns-value">{stats?.overview?.totalEmployees || 0}</div>
                            <div className="ns-title">Total Employees</div>
                        </div>
                        <div className="ns-progress"><div className="ns-progress-fill bg-blue" style={{ width: '100%' }}></div></div>
                    </div>

                    <div className="new-stat-card">
                        <div className="ns-header">
                            <div className="ns-icon ns-green"><UserCheck size={16} /></div>
                            <div className="ns-change positive"><ArrowUpRight size={12} strokeWidth={3} /> Today</div>
                        </div>
                        <div className="ns-body">
                            <div className="ns-value">{stats?.overview?.presentToday || 0}</div>
                            <div className="ns-title">Present Today</div>
                        </div>
                        <div className="ns-progress"><div className="ns-progress-fill bg-green" style={{ width: '100%' }}></div></div>
                    </div>

                    <div className="new-stat-card">
                        <div className="ns-header">
                            <div className="ns-icon ns-orange"><Building size={16} /></div>
                            <div className="ns-change positive"><ArrowUpRight size={12} strokeWidth={3} /> Active</div>
                        </div>
                        <div className="ns-body">
                            <div className="ns-value">{stats?.counts?.branches || 0}</div>
                            <div className="ns-title">Total Branches</div>
                        </div>
                        <div className="ns-progress"><div className="ns-progress-fill bg-orange" style={{ width: '100%' }}></div></div>
                    </div>

                    <div className="new-stat-card">
                        <div className="ns-header">
                            <div className="ns-icon ns-red"><Layers size={16} /></div>
                            <div className="ns-change positive"><ArrowUpRight size={12} strokeWidth={3} /> Active</div>
                        </div>
                        <div className="ns-body">
                            <div className="ns-value">{stats?.counts?.departments || 0}</div>
                            <div className="ns-title">Total Departments</div>
                        </div>
                        <div className="ns-progress"><div className="ns-progress-fill bg-red" style={{ width: '100%' }}></div></div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="charts-row">
                    <div className="chart-card hiring-card">
                        <div className="chart-header-new">
                            <div className="ch-info">
                                <h3>Employee Hiring Overview</h3>
                                <p>Monthly hires vs exits</p>
                            </div>
                            <a href="#" className="ch-link">View Report &rarr;</a>
                        </div>
                        <div style={{ width: '100%', height: 200, marginTop: '24px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hiringData} stackOffset="sign">
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                    <XAxis dataKey="name" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
                                    <Bar dataKey="exit" fill="#ef4444" radius={[0, 0, 4, 4]} barSize={35} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="chart-legend">
                            <span className="legend-item"><span className="dot bg-blue"></span> New Hires</span>
                            <span className="legend-item"><span className="dot bg-red"></span> Exits</span>
                        </div>
                    </div>

                    <div className="chart-card split-card">
                        <div className="chart-header-new">
                            <h3>Department Split</h3>
                            <a href="#" className="ch-link">Details &rarr;</a>
                        </div>
                        <div className="split-body">
                            <div className="donut-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deptData}
                                            innerRadius={35}
                                            outerRadius={55}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {deptData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="donut-center">
                                    <span>248</span>
                                </div>
                            </div>
                            <div className="split-legend">
                                {deptData.map((dept, i) => (
                                    <div className="split-legend-item" key={i}>
                                        <div className="sl-left">
                                            <span className="sl-dot" style={{ backgroundColor: DEPT_COLORS[i] }}></span>
                                            <span className="sl-name">{dept.name}</span>
                                        </div>
                                        <span className="sl-val">{dept.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="split-bottom-badges">
                            <div className="s-badge"><div className="sb-val" style={{ color: '#3b82f6' }}>18</div><div className="sb-lbl">On Leave</div></div>
                            <div className="s-badge"><div className="sb-val" style={{ color: '#10b981' }}>16</div><div className="sb-lbl">Remote</div></div>
                            <div className="s-badge"><div className="sb-val" style={{ color: '#f59e0b' }}>12</div><div className="sb-lbl">New Joining</div></div>
                            <div className="s-badge"><div className="sb-val" style={{ color: '#ef4444' }}>4</div><div className="sb-lbl">Probation</div></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="bottom-row">
                    {/* Recent Employees */}
                    <div className="bottom-card recent-employees-card">
                        <div className="chart-header-new">
                            <h3>Recent Employees</h3>
                            <a href="#" className="ch-link">View All &rarr;</a>
                        </div>
                        <div className="re-table-wrapper">
                            <table className="re-table">
                                <thead>
                                    <tr>
                                        <th>EMPLOYEE</th>
                                        <th>DEPT</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentEmployees.map((emp) => (
                                        <tr key={emp.id}>
                                            <td>
                                                <div className="emp-info">
                                                    <div className="emp-avatar" style={{ backgroundColor: emp.avatarColor }}>{emp.initials}</div>
                                                    <div className="emp-name-role">
                                                        <div className="emp-name">{emp.name}</div>
                                                        <div className="emp-role">{emp.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="emp-dept">{emp.dept}</span></td>
                                            <td><span className="emp-status" style={{ color: emp.statusColor }}>{emp.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payroll Summary */}
                    <div className="bottom-card payroll-card">
                        <div className="chart-header-new">
                            <h3>Payroll Summary</h3>
                            <a href="#" className="ch-link">Run Payroll &rarr;</a>
                        </div>
                        <div className="ps-list">
                            <div className="ps-item">
                                <span className="ps-label"><span className="ps-dot bg-blue"></span> Gross Salary</span>
                                <span className="ps-value">₹28,50,000</span>
                            </div>
                            <div className="ps-item">
                                <span className="ps-label"><span className="ps-dot bg-red"></span> Deductions</span>
                                <span className="ps-value" style={{ color: '#ef4444' }}>- ₹3,90,000</span>
                            </div>
                            <div className="ps-item">
                                <span className="ps-label"><span className="ps-dot bg-green"></span> Net Payable</span>
                                <span className="ps-value" style={{ color: '#10b981' }}>₹24,60,000</span>
                            </div>
                            <div className="ps-item">
                                <span className="ps-label"><span className="ps-dot bg-orange"></span> Tax (TDS)</span>
                                <span className="ps-value" style={{ color: '#f59e0b' }}>₹2,40,000</span>
                            </div>
                            <div className="ps-item">
                                <span className="ps-label"><span className="ps-dot bg-slate"></span> PF / ESI</span>
                                <span className="ps-value">₹1,50,000</span>
                            </div>
                        </div>
                        <div className="ps-action">
                            <div className="ps-action-info">
                                <span className="ps-nxt">Next Payroll</span>
                                <span className="ps-date">March 1, 2026</span>
                            </div>
                            <button className="ps-btn">Process Now</button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bottom-card activity-card">
                        <div className="chart-header-new" style={{ marginBottom: '16px' }}>
                            <h3>Recent Activity</h3>
                        </div>
                        <div className="ra-list">
                            {stats?.recentActivities?.map((activity: any) => (
                                <div className="ra-item" key={activity.id}>
                                    <div className="ra-icon bg-light-blue"><CheckCircle2 size={14} color="#3b82f6" /></div>
                                    <div className="ra-info">
                                        <p><strong>{activity.action}</strong></p>
                                        <span>{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                                <p style={{ color: '#94a3b8', fontSize: '13px' }}>No recent activity.</p>
                            )}
                        </div>
                    </div>

                    <div className="bottom-card quick-actions-card">
                        <div className="chart-header-new" style={{ marginBottom: '16px' }}>
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="qa-grid">
                            <button className="qa-btn">
                                <Plus size={16} color="#64748b" />
                                <span>Add Employee</span>
                            </button>
                            <button className="qa-btn">
                                <IndianRupee size={16} color="#64748b" />
                                <span>Run Payroll</span>
                            </button>
                            <button className="qa-btn">
                                <Briefcase size={16} color="#64748b" />
                                <span>Post Job</span>
                            </button>
                            <button className="qa-btn">
                                <FileBarChart size={16} color="#64748b" />
                                <span>Reports</span>
                            </button>
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
