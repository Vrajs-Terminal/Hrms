import { Router } from 'express';
import prisma from '../lib/prismaClient';
import { logActivity } from '../services/activityLogger';

const router = Router();

// Get all employee grades
router.get('/', async (req, res) => {
    try {
        const grades = await prisma.employeeGrade.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee grades' });
    }
});

// Create Employee Grade
router.post('/', async (req, res) => {
    const { name, code, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const grade = await prisma.employeeGrade.create({
            data: {
                name,
                code,
                status: status || 'Active'
            }
        });
        res.status(201).json(grade);
        logActivity(null, 'CREATED', 'EMPLOYEE_GRADE', grade.name);
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Grade code must be unique' });
        res.status(500).json({ error: 'Failed to create grade' });
    }
});

// Update Employee Grade
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, status } = req.body;

    try {
        const grade = await prisma.employeeGrade.update({
            where: { id: Number(id) },
            data: { name, code, status }
        });
        res.json(grade);
        logActivity(null, 'UPDATED', 'EMPLOYEE_GRADE', grade.name);
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Grade code must be unique' });
        res.status(500).json({ error: 'Failed to update grade' });
    }
});

// Delete Employee Grade
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const linkedUsers = await prisma.user.count({ where: { employee_grade_id: Number(id) } });
        if (linkedUsers > 0) {
            return res.status(400).json({ error: 'Cannot delete: Employees are actively assigned to this grade.' });
        }

        await prisma.employeeGrade.delete({ where: { id: Number(id) } });
        logActivity(null, 'DELETED', 'EMPLOYEE_GRADE', `Grade #${id}`);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete grade' });
    }
});

export default router;
