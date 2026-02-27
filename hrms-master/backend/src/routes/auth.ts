import { Router } from 'express';
import prisma from '../lib/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logActivity } from '../services/activityLogger';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_minehr';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify Password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: 'Internal server error during login', details: error.message });
    }
});

// Helper route to create an initial admin account if none exists
router.post('/setup-admin', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const admin = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                role: 'Admin'
            }
        });

        res.status(201).json({ message: 'Admin created successfully', admin: { id: admin.id, name: admin.name } });
        logActivity(admin.id, 'CREATED', 'USER', admin.name, { role: 'Admin', email });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create admin', details: error.message });
    }
});

// Create a new user from the Admin dashboard
router.post('/add-user', async (req, res) => {
    const { name, email, password, role = 'Admin' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                role
            }
        });

        res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, name: newUser.name } });
        logActivity(null, 'CREATED', 'USER', newUser.name, { role, email });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
});

// Delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'User deleted successfully' });
        logActivity(null, 'DELETED', 'USER', `User #${req.params.id}`);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});

// Admin forced password reset
router.put('/user/:id/password', async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'New password is required' });
    }
    try {
        const password_hash = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: { password_hash }
        });
        res.json({ message: 'Password updated successfully' });
        logActivity(null, 'UPDATED', 'USER', `User #${req.params.id}`, { action: 'Password Reset' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update password', details: error.message });
    }
});

export default router;
