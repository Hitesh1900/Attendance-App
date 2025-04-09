import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

const API_URL = 'http://localhost:5000';

type RootStackParamList = {
  Attendance: { userId: string };
  History: { userId: string };
  Profile: { userId: string };
};

type AttendanceRecord = {
  date: string;
  location: string;
  latitude: string;
  longitude: string;
};

type AttendanceHistoryParams = {
  AttendanceHistory: {
    userId?: string;
  };
};

const AttendanceHistoryScreen = () => {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Attendance' | 'History' | 'Profile'>('History');

  const route = useRoute<RouteProp<AttendanceHistoryParams, 'AttendanceHistory'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let passedUserId = route.params?.userId;
        if (!passedUserId) {
          const storedUserId = await AsyncStorage.getItem('userId');
          passedUserId = storedUserId || '';
        }

        setUserId(passedUserId);

        if (!passedUserId) {
          setErrorMessage('User not found.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/attendance/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: passedUserId }),
        });

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          setErrorMessage('Invalid server response.');
          return;
        }

        if (response.ok && data?.history) {
          setHistory(data.history);
        } else {
          setErrorMessage(data?.message || 'Failed to fetch attendance history.');
        }
      } catch (error) {
        setErrorMessage('Could not connect to the server. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [route.params?.userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Attendance History</Text>
        <Text style={styles.content}>Your last five Attendance records</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1 }} />
        ) : errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : history.length > 0 ? (
          <View style={styles.historyContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {history.slice(0, 5).map((item, index) => (
                <View key={index.toString()} style={styles.card}>
                  <Text style={styles.text}>Date: {item.date}</Text>
                  <Text style={styles.text}>Latitude: {item.latitude}</Text>
                  <Text style={styles.text}>Longitude: {item.longitude}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Text style={styles.noDataText}>No attendance records found.</Text>
        )}
      </View>

      <View style={styles.bottomNav}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={activeTab === 'Attendance' ? 'home' : 'home-outline'}
            size={28}
            color={activeTab === 'Attendance' ? '#1E88E5' : '#333'}
            onPress={() => {
              setActiveTab('Attendance');
              navigation.navigate('Attendance', { userId: userId || '' });
            }}
          />
          <Text style={[styles.iconLabel, activeTab === 'Attendance' && styles.activeLabel]}>
            Home
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons
            name={activeTab === 'History' ? 'time' : 'time-outline'}
            size={28}
            color={activeTab === 'History' ? '#1E88E5' : '#333'}
            onPress={() => {
              setActiveTab('History');
              navigation.navigate('History', { userId: userId || '' });
            }}
          />
          <Text style={[styles.iconLabel, activeTab === 'History' && styles.activeLabel]}>
            History
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons
            name={activeTab === 'Profile' ? 'person-circle' : 'person-circle-outline'}
            size={28}
            color={activeTab === 'Profile' ? '#1E88E5' : '#333'}
            onPress={() => {
              setActiveTab('Profile');
              navigation.navigate('Profile', { userId: userId || '' });
            }}
          />
          <Text style={[styles.iconLabel, activeTab === 'Profile' && styles.activeLabel]}>
            Profile
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AttendanceHistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 10,
    textAlign: 'left',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    color: '#64748B',
  },
  historyContainer: {
    flex: 1,
    marginBottom: 70,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: {
    fontSize: 14,
    color: '#334155',
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
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#1E88E5',
  },
});
