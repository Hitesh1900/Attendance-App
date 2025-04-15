import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Attendance: { userId: string };
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const API_URL = 'http://localhost:5000';

function HomeScreen({ navigation }: HomeScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userId', data.id);
        await AsyncStorage.setItem('username',data.name);

        navigation.navigate('Attendance', { userId: data.id });
      } else {
        setErrorMessage(data?.message || 'Invalid email or password. Try again.');
      }
    } catch (error) {
      setErrorMessage('Could not connect to the server. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOG IN</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Button title="Login" onPress={handleLogin} color="#1E88E5" />

      <View style={{ marginTop: 10 }}>
        <Button title="Don't have an account? Register" onPress={() => navigation.navigate('Register')} color="#757575" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  errorText: { color: 'red', fontSize: 16, marginBottom: 10 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
});

export default HomeScreen;
