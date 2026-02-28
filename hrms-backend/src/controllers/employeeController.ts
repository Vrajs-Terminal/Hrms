import { Request, Response } from "express";
import prisma from "../config/prisma";

// Helper to convert frontend "YYYY-MM-DD" back to ISO-8601 for Prisma
const parseDates = (data: any) => {
    const dateFields = ["dob", "doj", "trainingCompletionDate", "permanentDate", "insuranceExpiry"];
    const parsed = { ...data };

    dateFields.forEach(field => {
        if (parsed[field]) {
            parsed[field] = new Date(parsed[field]);
        } else {
            parsed[field] = null; // Send null if empty string
        }
    });

    // Remove transient frontend fields if any
    delete parsed.countryCode;
    delete parsed.leaveGroup;
    delete parsed.multiLevelLeave;
    delete parsed.expenseApproval;
    delete parsed.active;

    return parsed;
};

/* GET ALL ACTIVE EMPLOYEES */
export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/* GET SINGLE EMPLOYEE */
export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        const employee = await prisma.employee.findUnique({
            where: { employeeId: id },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/* CREATE EMPLOYEE */
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const data = parseDates(req.body);

        const activeEmployee = await prisma.employee.findUnique({
            where: { employeeId: data.employeeId },
        });

        if (activeEmployee) {
            return res.status(400).json({ message: "Employee already exists." });
        }

        const exEmployee = await prisma.exEmployee.findFirst({
            where: { employeeId: data.employeeId },
        });

        if (exEmployee) {
            return res.status(400).json({ message: "Employee already exists. Reactivate instead." });
        }

        const employee = await prisma.employee.create({
            data,
        });

        res.status(201).json(employee);
    } catch (error) {
        console.error("Create Employee Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

/* UPDATE EMPLOYEE */
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const data = parseDates(req.body);

        const updatedEmployee = await prisma.employee.update({
            where: { employeeId: id },
            data,
        });

        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Update Employee Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

/* REMOVE (MOVE TO EXEMPLOYEE) */
export const disableEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        const employee = await prisma.employee.findUnique({
            where: { employeeId: id },
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await prisma.exEmployee.create({
            data: {
                employeeId: employee.employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                designation: employee.designation,
                department: employee.department,
                exitDate: new Date(),
                eligibleForRehire: true,
            },
        });

        await prisma.employee.delete({
            where: { id: employee.id },
        });

        res.status(200).json({
            message: "Employee moved to Ex-Employees successfully.",
        });
    } catch (error) {
        console.error("Disable Employee Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

/* REACTIVATE EMPLOYEE */
export const reactivateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        const exEmployee = await prisma.exEmployee.findFirst({
            where: { employeeId: id },
        });

        if (!exEmployee) {
            return res.status(404).json({ message: "Ex-Employee not found" });
        }

        await prisma.employee.create({
            data: {
                employeeId: exEmployee.employeeId,
                firstName: exEmployee.firstName,
                lastName: exEmployee.lastName,
                email: exEmployee.email,
                designation: exEmployee.designation,
                department: exEmployee.department,
            },
        });

        await prisma.exEmployee.delete({
            where: { id: exEmployee.id },
        });

        res.status(200).json({
            message: "Employee reactivated successfully.",
        });
    } catch (error) {
        console.error("Reactivate Employee Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};