import express from "express";
import Employees from "../models/Employees.js";
import {calculateRetentionRate, createEmployeeController,filterBySalaryRange,getAverageSalaryByDepartment,getEmployeesByExperience, getTopEarners} from "../controllers/EmployeeController.js";

const router = express.Router();

router.post("/create", createEmployeeController);

router.get("/getAvgSalary", getAverageSalaryByDepartment);

router.get('/employees-by-experience', getEmployeesByExperience);

router.get('/top-earners', getTopEarners);

router.get('/retention-rate', calculateRetentionRate);

router.get('/employees-by-salary', filterBySalaryRange);

export default router;