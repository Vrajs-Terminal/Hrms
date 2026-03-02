import express from 'express';
import prisma from '../lib/prismaClient';

const router = express.Router();

// Get all WhatsApp Alerts
router.get('/', async (req, res) => {
    try {
        const alerts = await prisma.whatsAppAlert.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(alerts);
    } catch (error) {
        console.error("Error fetching whatsapp alerts:", error);
        res.status(500).json({ error: "Failed to fetch whatsapp alerts" });
    }
});

// Create a new WhatsApp Alert
router.post('/', async (req, res) => {
    try {
        const { alert_name, trigger_event, recipient_type, message_template, status } = req.body;

        const newAlert = await prisma.whatsAppAlert.create({
            data: {
                alert_name,
                trigger_event,
                recipient_type: recipient_type || "Employee",
                message_template,
                status: status || "Active"
            }
        });

        res.status(201).json(newAlert);
    } catch (error) {
        console.error("Error creating whatsapp alert:", error);
        res.status(500).json({ error: "Failed to create whatsapp alert" });
    }
});

// Update a WhatsApp Alert
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { alert_name, trigger_event, recipient_type, message_template, status } = req.body;

        const updatedAlert = await prisma.whatsAppAlert.update({
            where: { id: parseInt(id) },
            data: {
                alert_name,
                trigger_event,
                recipient_type,
                message_template,
                status
            }
        });

        res.json(updatedAlert);
    } catch (error) {
        console.error("Error updating whatsapp alert:", error);
        res.status(500).json({ error: "Failed to update whatsapp alert" });
    }
});

// Delete a WhatsApp Alert
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.whatsAppAlert.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting whatsapp alert:", error);
        res.status(500).json({ error: "Failed to delete whatsapp alert" });
    }
});

export default router;
