import { Attendance } from "../models/index.js";

export const markAttendance = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    const officeLat = 17.732501, officeLng = 83.321139; 

    const distance = Math.sqrt((latitude - officeLat) ** 2 + (longitude - officeLng) ** 2) * 111000;
    if (distance > 10) return res.status(400).json({ error: "User is not within the 10-meter range" });

    const attendance = await Attendance.create({ userId, latitude, longitude });
    res.json({ message: "Attendance marked", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};















