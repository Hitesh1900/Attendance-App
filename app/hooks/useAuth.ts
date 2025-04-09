import { useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";


type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Attendance: { userId: string };
  History:{userId: string};
  Profile:{userId: string};
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const login = async (username: string, password: string) => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        navigation.navigate("Attendance", { userId: response.data.userId });
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
