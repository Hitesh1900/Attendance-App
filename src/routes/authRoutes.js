import express from "express";
import { register, login,userProfile } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/profile', userProfile);

export default router;
