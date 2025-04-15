import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import faceRoutes from "./src/routes/faceRoutes.js";
import bodyParser from "body-parser";
import { loadModels } from "./src/utilis/faceApiSetup.js";


dotenv.config();
connectDB();

await loadModels();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/face",faceRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
