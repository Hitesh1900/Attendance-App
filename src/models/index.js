import { Sequelize } from "sequelize";
import UserModel from "./userModel.js";
import AttendanceModel from "./attendanceModel.js";

const sequelize = new Sequelize(process.env.DB_URL, { dialect: "postgres" });

const User = UserModel(sequelize);
const Attendance = AttendanceModel(sequelize);

// Define relationships
User.hasMany(Attendance, { foreignKey: "userId" });
Attendance.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, Attendance };
export default { sequelize, User, Attendance };
