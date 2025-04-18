import { Attendance } from "../models/index.js";

export const markAttendance = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    const officeLocations = [
      { name: "Main Office", lat: 17.7323140, lng: 83.321122 },
      { name: "Branch A", lat: 21.734321, lng: 21.734321 },
      { name: "Branch B", lat: 87.730100, lng: 33.322200 },
      { name: "Branch C", lat: 10.733000, lng: 83.318000 },
    ];

    const getDistance = (lat1, lng1, lat2, lng2) => {
      const toRadians = (degrees) => degrees * (Math.PI / 180);
      const R = 6371000;
      const dLat = toRadians(lat2 - lat1);
      const dLng = toRadians(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearbyLocation = officeLocations.find(loc => {
      const distance = getDistance(latitude, longitude, loc.lat, loc.lng);
      return distance <= 10;
    });

    if (!nearbyLocation) {
      return res.status(400).json({
        error: "User is not within the 10-meter range of any office location"
      });
    }

    const attendance = await Attendance.create({
      userId,
      latitude,
      longitude
    });

    res.json({
      message: `Attendance marked successfully at ${nearbyLocation.name}`,
      location: nearbyLocation.name,
      attendance
    });

  } catch (error) {
    console.error("Attendance marking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const history = await Attendance.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    const formatted = await Promise.all(
      history.map(async (entry) => {
        return {
          userId: entry.userId,
          date: new Date(entry.createdAt).toLocaleString(),
          latitude: entry.latitude,
          longitude: entry.longitude,
        };
      })
    );

    return res.json({ history: formatted });
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

