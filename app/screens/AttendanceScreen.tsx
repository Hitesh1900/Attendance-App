import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import Webcam from 'react-webcam';
import { freezeEnabled } from 'react-native-screens';

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Attendance: { userId: string };
  History: { userId: string };
  Profile: { userId: string };
};

type AttendanceScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const API_URL = 'http://localhost:5000';

const AttendanceScreen = () => {
  const navigation = useNavigation<AttendanceScreenNavigationProp>();
  
  const webcamRef = useRef<Webcam | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [markingAttendance, setMarkingAttendance] = useState<boolean>(false);
  const [attendanceMessage, setAttendanceMessage] = useState<string | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'Attendance' | 'History' | 'Profile'>('Attendance');
  const [photoTaken, setPhotoTaken] = useState<string | null>(null); 
  const [cameraOpen, setCameraOpen] = useState<boolean>(false); 

  useEffect(() => {
    const fetchAuthData = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedUserId) setUserId(storedUserId);
      if (storedUsername) setUsername(storedUsername);
      if (storedToken) setAuthToken(storedToken);
    };

    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAttendanceMessage('Location permission denied. Please enable it in settings.');
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch {
        setAttendanceMessage('Unable to fetch location.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
    getLocation();
  }, []);

  const markAttendance = async () => {
    if (!photoTaken) {
      setAttendanceMessage('Please capture your photo for face verification.');
      return;
    }

    setMarkingAttendance(true);
    setAttendanceMessage(null);
    setCameraOpen(false); 

    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedUserId || !storedToken) {
        setAttendanceMessage('Authentication error. Please log in again.');
        setMarkingAttendance(false);
        return;
      }

      const faceResponse = await fetch(`${API_URL}/api/face/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ image: photoTaken }), 
      });

      const faceData = await faceResponse.json();
      if (!faceResponse.ok || faceData.status !== 'success') {
        setAttendanceMessage(faceData.message || 'Face verification failed.');
        setMarkingAttendance(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      const attendanceResponse = await fetch(`${API_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          userId: storedUserId,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }),
      });

      const attendanceData = await attendanceResponse.json();
      if (attendanceResponse.ok) {
        setAttendanceMessage(attendanceData.message || 'Attendance marked successfully!');
        setAttendanceMarked(true);
      } else {
        setAttendanceMessage(attendanceData.message || 'Failed to mark attendance.');
      }
    } catch (err) {
      console.error(err);
      setAttendanceMessage('Something went wrong. Try again.');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setPhotoTaken(screenshot);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GRAB YOUR ATTENDANCE</Text>
      <Text style={styles.subtitle}>Your location will be used to mark attendance.</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{userId}</Text>

          <Text style={styles.label}>User Name:</Text>
          <Text style={styles.value}>{username}</Text>

          <Text style={styles.label}>Location:</Text>
          {location ? (
            <Text style={styles.value}>
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </Text>
          ) : (
            <Text style={[styles.value, { color: '#EF4444' }]}>Location not available</Text>
          )}

          {cameraOpen && (
            <Webcam
              audio={false}
              height={240}
              width="100%"
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              ref={webcamRef}
            />
          )}

          <Button
            title="Mark Attendance"
            onPress={() => {
              setCameraOpen(true); 
              capturePhoto();
              markAttendance();
            }}
            color="#2563EB"
            disabled={attendanceMarked || markingAttendance}
          />

          {markingAttendance && <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 10 }} />}
          {attendanceMessage && (
            <Text
              style={{
                marginTop: 15,
                fontSize: 14,
                textAlign: 'center',
                fontWeight: 'bold',
                color: attendanceMarked ? '#16A34A' : '#DC2626',
              }}
            >
              {attendanceMessage}
            </Text>
          )}
        </View>
      )}

      <View style={styles.bottomNav}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={activeTab === 'Attendance' ? 'home' : 'home-outline'}
            size={28}
            color={activeTab === 'Attendance' ? '#2563EB' : '#333'}
            onPress={() => {
              setActiveTab('Attendance');
              navigation.navigate('Attendance', { userId: userId || '' });
            }}
          />
          <Text style={[styles.iconLabel, activeTab === 'Attendance' && { color: '#2563EB', fontWeight: 'bold' }]} >
            Home
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons
            name={activeTab === 'History' ? 'time' : 'time-outline'}
            size={28}
            color={activeTab === 'History' ? '#2563EB' : '#333'}
            onPress={() => {
              setActiveTab('History');
              navigation.navigate('History', { userId: userId || '' });
            }}
          />
          <Text style={[styles.iconLabel, activeTab === 'History' && { color: '#2563EB', fontWeight: 'bold' }]} >
            History
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons
            name={activeTab === 'Profile' ? 'person-circle' : 'person-circle-outline'}
            size={28}
            color={activeTab === 'Profile' ? '#2563EB' : '#333'}
            onPress={() => {
              setActiveTab('Profile');
              navigation.navigate('Profile', { userId: userId || '' });
            }}
          />
          <Text style={[styles.iconLabel, activeTab === 'Profile' && { color: '#2563EB', fontWeight: 'bold' }]} >
            Profile
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
});
