import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            orderBy: { order_index: 'asc' },
            include: { branch: true }
        });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

// Create a new department
router.post('/', async (req, res) => {
    const { name, branch_id } = req.body;

    if (!name || !branch_id) {
        return res.status(400).json({ error: 'Name and Branch ID are required' });
    }

    try {
        // Check branch exists
        const branch = await prisma.branch.findUnique({ where: { id: parseInt(branch_id) } });
        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        const maxOrder = await prisma.department.aggregate({
            where: { branch_id: parseInt(branch_id) },
            _max: { order_index: true }
        });
        const nextOrder = (maxOrder._max.order_index || 0) + 1;

        const department = await prisma.department.create({
            data: {
                name,
                branch_id: parseInt(branch_id),
                order_index: nextOrder
            }
        });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create department' });
    }
});

// Delete a department
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.department.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete department' });
    }
});

export default router;
