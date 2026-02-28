import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import employeeRoutes from "./routes/employeeRoutes";
import exEmployeeRoutes from "./routes/exEmployeeRoutes";
import financeRoutes from "./routes/financeRoutes";
import managerRoutes from "./routes/managerRoutes";
import onboardingRoutes from "./routes/onboardingRoutes";
import offboardingRoutes from "./routes/offboardingRoutes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/exemployees", exEmployeeRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/offboarding", offboardingRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("HRMS Prisma+TypeScript Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
