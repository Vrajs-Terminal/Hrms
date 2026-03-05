import { useState } from 'react';
import { Filter, Download, Edit, RefreshCcw } from 'lucide-react';
import './attendance.css';
import { useAttendanceRecords, useAttendanceData, formatTime, formatDate, getInitials, getAvatarColor } from './useAttendanceHooks';
const PendingAttendance = () => {
  const { employees } = useAttendanceData();
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [empId, setEmpId] = useState('');
  const { records, loading, fetchRecords } = useAttendanceRecords({ start_date: startDate, end_date: endDate, user_id: empId, status: 'Pending' });

  const handleFilter = () => fetchRecords({ start_date: startDate, end_date: endDate, user_id: empId, status: 'Pending' });

  return (
    <div className="attendance-module-container">
      <div className="attendance-header">
        <div>
          <h2 className="attendance-title">Pending Attendance</h2>
          <p className="attendance-subtitle">Review unverified or flagged punch records needing admin attention.</p>
        </div>
        <div className="attendance-actions">
          <button className="btn-secondary"><Download size={16} /> Export Issue Log</button>
          <button className="btn-primary" onClick={handleFilter}><RefreshCcw size={16} /> Refresh</button>
        </div>
      </div>

      <div className="attendance-filters-bar">
        <div className="filter-group"><label>From</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
        <div className="filter-group"><label>To</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
        <div className="filter-group"><label>Employee</label>
          <select value={empId} onChange={e => setEmpId(e.target.value)}>
            <option value="">All Problem Records</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="filter-buttons"><button className="btn-apply" onClick={handleFilter}><Filter size={16} /> Find Issues</button></div>
      </div>

      <div className="attendance-table-card" style={{ padding: 0 }}>
        <table className="attendance-table">
          <thead><tr><th>Employee</th><th>Date</th><th>In Time</th><th>Out Time</th><th>Detected Issue</th><th>Resolve</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Loading...</td></tr>
              : records.length > 0 ? records.map(row => (
                <tr key={row.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: '50%', background: getAvatarColor(row.user_id), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{getInitials(row.user?.name || '')}</div><span style={{ fontSize: 13, fontWeight: 600 }}>{row.user?.name}</span></div></td>
                  <td>{formatDate(row.date)}</td>
                  <td style={{ fontSize: 13 }}>{formatTime(row.in_time)}</td>
                  <td style={{ fontSize: 13 }}>{formatTime(row.out_time)}</td>
                  <td><span className={`badge badge-late`}>{row.remarks || 'Missing Out Punch'}</span></td>
                  <td><button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => window.location.href = '#/update-attendance'}><Edit size={12} /> Fix Record</button></td>
                </tr>
              )) : <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>No pending attendance issues found. Everything looks good!</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingAttendance;
