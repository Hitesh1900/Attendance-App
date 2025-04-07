import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/mark", authenticate, markAttendance);

export default router;
