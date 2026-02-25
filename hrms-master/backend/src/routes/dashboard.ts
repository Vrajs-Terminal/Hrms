import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', async (req, res) => {
    try {
        const totalEmployees = await prisma.user.count();
        const totalBranches = await prisma.branch.count();
        const totalDepartments = await prisma.department.count();

        // In the future, newHires, onLeave, and presentToday will be calculated
        // from the Payroll/Attendance tables.
        res.json({
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
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

export default router;
