import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import prisma from './lib/prismaClient';

// CORS origins: allow Vercel deployments and local dev
const allowedOrigins = [
    /\.vercel\.app$/,           // any *.vercel.app subdomain
    /^http:\/\/localhost(:\d+)?$/,   // localhost dev
    /^http:\/\/127\.0\.0\.1(:\d+)?$/ // 127.0.0.1 dev
];

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
import shiftsRoutes from './routes/shifts';
import attendanceRoutes from './routes/attendance';
import attendanceRequestsRoutes from './routes/attendance-requests';
import documentRequestsRoutes from './routes/document-requests';
import expensesRoutes from './routes/expenses';
import breaksRoutes from './routes/breaks';
import geofencesRoutes from './routes/geofences';
import trackingRoutes from './routes/tracking';
import trackingExceptionsRoutes from './routes/tracking-exceptions';
import trackingConfigRoutes from './routes/tracking-config';
import dailyWorkReportsRoutes from './routes/daily-work-reports';
import visitRoutes from './routes/visit';
import searchRoutes from './routes/search';

const app = express();

const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
}));
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Vercel SSR)
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.some(pattern =>
            typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
        );
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); // permissive for now — restrict once domain confirmed
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Allow us to receive JSON from React

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter); // Apply to all /api/ endpoints

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
app.use('/api/shifts', shiftsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/attendance-requests', attendanceRequestsRoutes);
app.use('/api/document-requests', documentRequestsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/breaks', breaksRoutes);
app.use('/api/geofences', geofencesRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/tracking-exceptions', trackingExceptionsRoutes);
app.use('/api/tracking-config', trackingConfigRoutes);
app.use('/api/daily-work-reports', dailyWorkReportsRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/search', searchRoutes);

// Health check route — used to verify live deployment
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', message: 'MineHR Backend is running perfectly!', db: 'connected', env: process.env.NODE_ENV || 'development' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Database connection failed', db: 'disconnected' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;
