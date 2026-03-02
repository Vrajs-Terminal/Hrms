import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import prisma from './lib/prismaClient';

import authRoutes from './routes/auth';
import companyRoutes from './routes/company';
import companiesRoutes from './routes/companies';
import employeeLevelsRoutes from './routes/employee-levels';
import employeeGradesRoutes from './routes/employee-grades';
import adminRightsRoutes from './routes/admin-rights';
import branchesRoutes from './routes/branches';
import departmentRoutes from './routes/departments';
import dashboardRoutes from './routes/dashboard';
import zonesRoutes from './routes/zones';
import subDepartmentRoutes from './routes/sub-departments';
import designationRoutes from './routes/designations';
import notificationRoutes from './routes/notifications';
import idCardTemplatesRoutes from './routes/id-card-templates';
import dailyAttendanceEmailRoutes from './routes/daily-attendance-email';
import employeeParkingRoutes from './routes/employee-parking';
import emergencyNumbersRoutes from './routes/emergency-numbers';
import settingsRoutes from './routes/settings';
import whatsappAlertsRoutes from './routes/whatsapp-alerts';

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow us to receive JSON from React

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/employee-levels', employeeLevelsRoutes);
app.use('/api/employee-grades', employeeGradesRoutes);
app.use('/api/admin-rights', adminRightsRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/sub-departments', subDepartmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/id-card-templates', idCardTemplatesRoutes);
app.use('/api/daily-attendance-email', dailyAttendanceEmailRoutes);
app.use('/api/employee-parking', employeeParkingRoutes);
app.use('/api/emergency-numbers', emergencyNumbersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/whatsapp-alerts', whatsappAlertsRoutes);

// Basic test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MineHR Backend is running perfectly!' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;
