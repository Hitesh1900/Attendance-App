import { Attendance } from "../models/attendanceModel.js"; // Directly import Attendance model

export async function markAttendance(userId, latitude, longitude) {
  const officeLat = 17.732501, officeLng = 83.321139
  ;  

  const R = 6371000; 
  const toRadians = (deg) => (deg * Math.PI) / 180;
  
  const lat1 = toRadians(officeLat);
  const lat2 = toRadians(latitude);
  const deltaLat = toRadians(latitude - officeLat);
  const deltaLng = toRadians(longitude - officeLng);

  const a = Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance > 10) throw new Error("User is not within the 10-meter range");

  return await Attendance.create({ userId, latitude, longitude });
}
