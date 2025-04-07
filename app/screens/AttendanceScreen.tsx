import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000';

const AttendanceScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [markingAttendance, setMarkingAttendance] = useState<boolean>(false);
  const [attendanceMessage, setAttendanceMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedUserId) setUserId(storedUserId);
        if (storedToken) setAuthToken(storedToken);
      } catch (error) {
        console.error('Error fetching auth data:', error);
      }
    };

    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAttendanceMessage('Location permission denied. Please enable it in settings.');
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (loc && loc.coords) {
          setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        } else {
          setAttendanceMessage('Unable to get location.');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setAttendanceMessage('Error fetching location. Try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
    getLocation();
  }, []);

  const markAttendance = async () => {
    setMarkingAttendance(true);
    setAttendanceMessage(null); // Clear previous messages

    if (!location || !userId || !authToken) {
      setAttendanceMessage('Missing required data. Ensure location and authentication details are available.');
      setMarkingAttendance(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          userId,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAttendanceMessage(data.message || 'Attendance marked successfully!');
      } else {
        setAttendanceMessage(data.message || 'Failed to mark attendance.');
      }
    } catch (error) {
      console.error('Error sending attendance:', error);
      setAttendanceMessage('Error: Failed to mark attendance. Please try again.');
    } finally {
      setMarkingAttendance(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 }}>
        GRAB YOUR ATTENDANCE
      </Text>
      <Text style={{ fontSize: 16, color: '#475569', marginBottom: 20, textAlign: 'center' }}>
        Your location will be used to mark attendance.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B' }}>User ID:</Text>
          <Text style={{ fontSize: 14, color: '#475569', marginBottom: 10 }}>{userId}</Text>

          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B' }}>Location:</Text>
          {location ? (
            <Text style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </Text>
          ) : (
            <Text style={{ fontSize: 14, color: '#EF4444', marginBottom: 20 }}>Location not available</Text>
          )}

          <Button
            title="Mark Attendance"
            onPress={markAttendance}
            color="#2563EB"
            disabled={markingAttendance}
          />

          {markingAttendance && (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 10 }} />
          )}

          {attendanceMessage && (
            <Text
              style={{
                marginTop: 15,
                fontSize: 14,
                textAlign: 'center',
                color: attendanceMessage.toLowerCase().includes('success') ? '#16A34A' : '#DC2626',
              }}
            >
              {attendanceMessage}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AttendanceScreen;
