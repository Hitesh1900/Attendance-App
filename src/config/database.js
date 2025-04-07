import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();  // ✅ Load environment variables

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("❌ Database URL is not set. Check your .env file.");
}

export const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
