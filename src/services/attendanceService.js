import { Attendance } from "../models/attendanceModel.js"; 

export async function markAttendance(userId, latitude, longitude) {
  const officeLocations = [
    { lat: 17.732501, lng: 83.321139 },
    { lat: 21.734321, lng: 21.734321 },
    { lat: 87.730100, lng: 33.322200 },
    { lat: 10.733000, lng: 83.318000 },
  ]
  ;  

  const R = 6371000; 
  const toRadians = (deg) => (deg * Math.PI) / 180;
  
  const lat1 = toRadians(officeLocations);
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
