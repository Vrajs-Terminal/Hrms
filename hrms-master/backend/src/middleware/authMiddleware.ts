import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_minehr';

// Extend Express Request to inject User object
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);

        // Fetch user with their restrictions
        const user = await prisma.user.findUnique({
            where: { id: decoded.id || decoded.userId },
            include: {
                adminBranchRestrictions: true,
                adminDepartmentRestrictions: true
            }
        });

        if (!user) return res.status(401).json({ error: 'User not found in system.' });

        // Build restriction arrays
        req.user = {
            id: user.id,
            role: user.role,
            restrictedBranchIds: (user as any).adminBranchRestrictions.map((r: any) => r.branch_id),
            restrictedDepartmentIds: (user as any).adminDepartmentRestrictions.map((r: any) => r.department_id)
        };

        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
