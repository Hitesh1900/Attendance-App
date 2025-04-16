import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import attendanceModel from "../models/attendanceModel.js";

dotenv.config();

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("❌ Database URL is not set. Check your .env file.");
}

export const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  logging: console.log,
});

const Attendance = attendanceModel(sequelize);
const User = userModel(sequelize);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ All tables are synced successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
