import { Router } from 'express';
import prisma from '../lib/prismaClient';

const router = Router();

// Get recent notifications (compact: 5, full: 100)
router.get('/', async (req, res) => {
    try {
        const limitStr = req.query.limit as string;
        const limit = limitStr ? parseInt(limitStr) : 50;

        const logs = await prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });

        res.json(logs);
    } catch (error: any) {
        console.error('Failed to fetch activity logs:', error?.message);
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
});

export default router;
