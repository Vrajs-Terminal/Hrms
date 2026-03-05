import { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/auth/login";
import CompanySetup from "./pages/company_settings/company-setup";
import Branches from "./pages/company_settings/branches";
import Departments from "./pages/company_settings/departments";
import Zones from "./pages/company_settings/zones";
import SubDepartments from "./pages/company_settings/sub-departments";
import Designations from "./pages/company_settings/designations";
import SisterCompanies from "./pages/company_settings/sister-companies";
import EmployeeLevels from "./pages/company_settings/employee-levels";
import EmployeeGrades from "./pages/company_settings/employee-grades";
import AdminRights from "./pages/company_settings/admin-rights";
import AssignEmployeeGrade from "./pages/company_settings/assign-employee-grade";
import EmployeeParking from "./pages/company_settings/employee-parking";
import EmergencyNumbers from "./pages/company_settings/emergency-numbers";
import AdminMenuReordering from "./pages/company_settings/admin-menu-reordering";
import WhatsAppAlerts from "./pages/company_settings/whatsapp-alerts";
import IDCardTemplates from "./pages/company_settings/id-card-templates";
import DailyAttendanceEmail from "./pages/company_settings/daily-attendance-email";
import { useAuthStore } from "./store/useAuthStore";

import AttendanceDashboard from "./pages/attendance/attendance-dashboard";
import ViewAttendance from "./pages/attendance/view-attendance";
import AddAttendance from "./pages/attendance/add-attendance";
import MonthWiseAttendance from "./pages/attendance/month-wise-attendance";
import WeeklyAttendance from "./pages/attendance/weekly-attendance";
import PendingAttendance from "./pages/attendance/pending-attendance";
import PunchOutMissingRequest from "./pages/attendance/punch-out-missing-request";
import PunchOutMissingApproval from "./pages/attendance/punch-out-missing-approval";
import PreviousDateAttendance from "./pages/attendance/previous-date-attendance";
import UpdateAttendance from "./pages/attendance/update-attendance";
import UpdateBreak from "./pages/attendance/update-break";
import WeekOffExchangeRequest from "./pages/attendance/week-off-exchange-request";
import WeekOffApproval from "./pages/attendance/week-off-approval";
import AbsentEmployees from "./pages/attendance/absent-employees";
import AddBulkAttendance from "./pages/attendance/bulk-attendance";
import PendingBreak from "./pages/attendance/pending-break";
import BreakApproval from "./pages/attendance/break-approval";
import OvertimeRequest from "./pages/attendance/overtime-request";
import OvertimeApproval from "./pages/attendance/overtime-approval";
import DeleteAttendance from "./pages/attendance/delete-attendance";
import AttendanceModification from "./pages/attendance/attendance-modification";
import RecalculateAttendance from "./pages/attendance/recalculate-attendance";
import PendingFlags from "./pages/attendance/pending-flags";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Login />
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="main-area">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="content-area" style={{ overflow: 'auto', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/company-setup" element={<CompanySetup />} />
              <Route path="/sister-companies" element={<SisterCompanies />} />
              <Route path="/employee-levels" element={<EmployeeLevels />} />
              <Route path="/employee-grades" element={<EmployeeGrades />} />
              <Route path="/admin-rights" element={<AdminRights />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/sub-departments" element={<SubDepartments />} />
              <Route path="/designations" element={<Designations />} />
              <Route path="/assign-employee-grade" element={<AssignEmployeeGrade />} />
              <Route path="/employee-parking" element={<EmployeeParking />} />
              <Route path="/emergency-numbers" element={<EmergencyNumbers />} />
              <Route path="/admin-menu-reordering" element={<AdminMenuReordering />} />
              <Route path="/whatsapp-alerts" element={<WhatsAppAlerts />} />
              <Route path="/id-card-templates" element={<IDCardTemplates />} />
              <Route path="/daily-attendance-email" element={<DailyAttendanceEmail />} />

              <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
              <Route path="/view-attendance" element={<ViewAttendance />} />
              <Route path="/add-attendance" element={<AddAttendance />} />
              <Route path="/month-wise-attendance" element={<MonthWiseAttendance />} />
              <Route path="/weekly-attendance" element={<WeeklyAttendance />} />
              <Route path="/pending-attendance" element={<PendingAttendance />} />
              <Route path="/punch-out-missing-request" element={<PunchOutMissingRequest />} />
              <Route path="/punch-out-missing-approval" element={<PunchOutMissingApproval />} />
              <Route path="/previous-date-attendance" element={<PreviousDateAttendance />} />
              <Route path="/update-attendance" element={<UpdateAttendance />} />
              <Route path="/update-break" element={<UpdateBreak />} />
              <Route path="/week-off-exchange" element={<WeekOffExchangeRequest />} />
              <Route path="/week-off-approval" element={<WeekOffApproval />} />
              <Route path="/absent-employees" element={<AbsentEmployees />} />
              <Route path="/add-bulk-attendance" element={<AddBulkAttendance />} />
              <Route path="/pending-break" element={<PendingBreak />} />
              <Route path="/break-approval" element={<BreakApproval />} />
              <Route path="/overtime-request" element={<OvertimeRequest />} />
              <Route path="/overtime-approval" element={<OvertimeApproval />} />
              <Route path="/delete-attendance" element={<DeleteAttendance />} />
              <Route path="/attendance-modification" element={<AttendanceModification />} />
              <Route path="/recalculate-attendance" element={<RecalculateAttendance />} />
              <Route path="/pending-flags" element={<PendingFlags />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
