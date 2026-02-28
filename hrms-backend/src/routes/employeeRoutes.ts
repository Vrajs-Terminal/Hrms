import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  disableEmployee,
  reactivateEmployee,
} from "../controllers/employeeController";

const router = express.Router();

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.put("/:id/disable", disableEmployee);
router.put("/:id/reactivate", reactivateEmployee);

export default router;