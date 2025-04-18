import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,Button,TouchableOpacity,useColorScheme,Alert,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Attendance: { userId: string };
  History: { userId: string };
  Profile: { userId: string };
};

type Props = {
  route: { params: { userId: string } };
};

const API_URL = 'http://localhost:5000';

const ProfileScreen = ({ route }: Props) => {
  const { userId } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('Profile');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    Alert.alert('Logged out', 'You have been logged out.');
    navigation.navigate('Home');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: '#F5F5F5' },
      ]}
    >
      <Text style={[styles.title, { color:'#333' }]}>
        User Profile
      </Text>

      {user ? (
        <View
          style={[
            styles.profileCard,
            { backgroundColor:'#fff' },
          ]}
        >
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-circle-outline"
              size={80}
              color={'#1E88E5'}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.name, { color:'#333' }]}>
              Name: {user.name}
            </Text>
            <Text style={[styles.detail, { color:'#555' }]}>
              ID: {user.id}
            </Text>
            <Text style={[styles.detail, { color: '#555' }]}>
              Email: {user.email}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={{ color: '#333' }}>Loading...</Text>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Update', 'Profile update feature coming soon.')}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Change Password', 'Password change feature coming soon.')}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#EF4444',borderColor:'#FFF', }]} onPress={handleLogout}>
          <Text style={[styles.buttonText, { color: '#FFF' }]}>Log out</Text>
        </TouchableOpacity>
      </View>

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
          <Text
            style={[
              styles.iconLabel,
              activeTab === 'Attendance' && {
                color: '#2563EB',
                fontWeight: 'bold',
              },
            ]}
          >
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
          <Text
            style={[
              styles.iconLabel,
              activeTab === 'History' && {
                color: '#2563EB',
                fontWeight: 'bold',
              },
            ]}
          >
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
          <Text
            style={[
              styles.iconLabel,
              activeTab === 'Profile' && {
                color: '#2563EB',
                fontWeight: 'bold',
              },
            ]}
          >
            Profile
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    paddingBottom: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    borderWidth: 2,
    borderColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 180,
},
  
  buttonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
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
});

export default ProfileScreen;
