import { Router } from 'express';
import prisma from '../lib/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logActivity } from '../services/activityLogger';
import nodemailer from 'nodemailer';

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

// ==========================================
// Forgot Password & Reset Flow
// ==========================================

// Setup dummy/optional transporter for sending OTPs
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal_password'
    }
});

// 1. Request OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // For security, don't reveal if user exists or not immediately.
            return res.json({ message: 'If this email exists, an OTP has been sent.' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordOtp: otp,
                resetPasswordOtpExpiry: expiry
            }
        });

        console.log(`\n\n=== DEV LOG: OTP FOR ${email} IS ${otp} ===\n\n`);

        // Attempt to send email, but don't crash if SMTP is unconfigured
        try {
            if (process.env.SMTP_HOST) {
                await transporter.sendMail({
                    from: `"MineHR System" <${process.env.SMTP_USER || 'noreply@minehr.com'}>`,
                    to: email,
                    subject: 'MineHR - Password Reset OTP',
                    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
                    html: `<b>Your OTP for password reset is:</b> <h1>${otp}</h1><p>It is valid for 10 minutes.</p>`
                });
            }
        } catch (emailErr) {
            console.error('Failed to send email (SMTP likely unconfigured):', emailErr);
        }

        res.json({ message: 'OTP generated and sent successfully.' });
        logActivity(user.id, 'REQUESTED', 'PASSWORD_RESET', 'User requested password reset OTP');
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to process forgot password request', details: error.message });
    }
});

// 2. Verify OTP only
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.resetPasswordOtp !== otp) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        if (!user.resetPasswordOtpExpiry || user.resetPasswordOtpExpiry < new Date()) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        res.json({ message: 'OTP verified successfully. Proceed to reset password.' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to verify OTP', details: error.message });
    }
});

// 3. Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.resetPasswordOtp !== otp) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        if (!user.resetPasswordOtpExpiry || user.resetPasswordOtpExpiry < new Date()) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        const password_hash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password_hash,
                resetPasswordOtp: null,
                resetPasswordOtpExpiry: null
            }
        });

        res.json({ message: 'Password has been reset successfully. You can now login.' });
        logActivity(user.id, 'UPDATED', 'USER', 'User successfully reset their password via OTP');
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to reset password', details: error.message });
    }
});

export default router;
