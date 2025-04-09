import express from "express";
import { getAttendanceHistory, markAttendance } from "../controllers/attendanceController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/mark", authenticate, markAttendance);
router.post("/get",getAttendanceHistory)

export default router;
