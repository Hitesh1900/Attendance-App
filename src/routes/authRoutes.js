import express from "express";
import { register, login,userProfile, updateProfile, changePassword } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/profile', userProfile);
router.post('/update',updateProfile);
router.post('/change-password',changePassword)

export default router;

