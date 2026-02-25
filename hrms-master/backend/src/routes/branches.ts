import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all branches
router.get('/', async (req, res) => {
    try {
        const branches = await prisma.branch.findMany({
            orderBy: { order_index: 'asc' },
            include: { departments: true }
        });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});

// Create a new branch
router.post('/', async (req, res) => {
    const { name, code, type } = req.body;

    if (!name || !code) {
        return res.status(400).json({ error: 'Name and Code are required' });
    }

    try {
        const existingBranch = await prisma.branch.findUnique({ where: { code } });
        if (existingBranch) {
            return res.status(400).json({ error: 'Branch code already exists' });
        }

        const maxOrder = await prisma.branch.aggregate({
            _max: { order_index: true }
        });
        const nextOrder = (maxOrder._max.order_index || 0) + 1;

        const branch = await prisma.branch.create({
            data: {
                name,
                code,
                type: type || 'Metro',
                order_index: nextOrder
            },
            include: { departments: true }
        });
        res.status(201).json(branch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create branch' });
    }
});

// Delete a branch
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Check if it has departments
        const branch = await prisma.branch.findUnique({
            where: { id: parseInt(id) },
            include: { departments: true }
        });

        if (!branch) return res.status(404).json({ error: 'Branch not found' });
        if (branch.departments.length > 0) {
            return res.status(400).json({ error: 'Cannot delete branch with active departments' });
        }

        await prisma.branch.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete branch' });
    }
});

export default router;
