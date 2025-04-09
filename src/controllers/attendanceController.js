import { Attendance } from "../models/index.js";

export const markAttendance = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    const officeLocations = [
      { name: "Main Office", lat: 17.732501, lng: 83.321139 },
      { name: "Branch A", lat: 21.734321, lng: 21.734321 },
      { name: "Branch B", lat: 87.730100, lng: 33.322200 },
      { name: "Branch C", lat: 10.733000, lng: 83.318000 },
    ];

    const getDistance = (lat1, lng1, lat2, lng2) => {
      return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2) * 111000;
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

