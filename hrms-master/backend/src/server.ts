import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from '../lib/prismaClient';

import authRoutes from './routes/auth';
import companyRoutes from './routes/company';
import branchesRoutes from './routes/branches';
import departmentRoutes from './routes/departments';
import dashboardRoutes from './routes/dashboard';
import zonesRoutes from './routes/zones';
import subDepartmentRoutes from './routes/sub-departments';
import designationRoutes from './routes/designations';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow us to receive JSON from React

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/sub-departments', subDepartmentRoutes);
app.use('/api/designations', designationRoutes);

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
