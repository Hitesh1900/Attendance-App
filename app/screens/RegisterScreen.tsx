import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000';

function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('Please enter all the credentials.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        navigation.navigate('Home');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTER</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
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
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Button title="REGISTER" onPress={handleRegister} color="#1E88E5" />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Home')}
          color="#757575"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  errorText: { color: 'red', fontSize: 16, marginBottom: 10, textAlign: 'center' },
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

export default RegisterScreen;
