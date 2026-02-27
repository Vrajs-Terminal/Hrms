import { Router } from 'express';
import prisma from '../lib/prismaClient';

const router = Router();


// Simple in-memory cache to prevent redundant DB hits on Vercel Edge Serverless
let cachedStats: any = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60000; // 60 seconds

router.get('/stats', async (req, res) => {
    try {
        const now = Date.now();
        if (cachedStats && (now - lastCacheTime) < CACHE_TTL_MS) {
            return res.json(cachedStats);
        }

        const [totalEmployees, totalBranches, totalDepartments] = await Promise.all([
            prisma.user.count(),
            prisma.branch.count(),
            prisma.department.count()
        ]);

        // In the future, newHires, onLeave, and presentToday will be calculated
        // from the Payroll/Attendance tables.
        cachedStats = {
            overview: {
                totalEmployees,
                newHires: 0,
                onLeave: 0,
                presentToday: totalEmployees > 0 ? 1 : 0 // Just showing Admin usually
            },
            counts: {
                branches: totalBranches,
                departments: totalDepartments
            },
            recentActivities: [
                { id: 1, action: 'System initialized successfully', type: 'system', time: 'Today' }
            ]
        };
        lastCacheTime = now;
        res.json(cachedStats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

export default router;
