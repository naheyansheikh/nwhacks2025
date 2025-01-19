import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../services/supabaseClient"; // Ensure the path is correct

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Navigate to Spaces screen after successful login
      Alert.alert("Success", "Logged in successfully!");
      router.push("/screens/listOfGroceries");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Unknown error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6D8299"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6D8299"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Signup Option */}
      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Link href="/screens/signupScreen" style={styles.signupLink}>
          Go to Signup
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0C4DE",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6D8299",
    marginBottom: 24,
  },
  input: {
    width: "90%",
    backgroundColor: "#D9E6F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "black",
    fontSize: 16,
  },
  loginButton: {
    width: "90%",
    backgroundColor: "#6D8299",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 16,
    color: "#6D8299",
    fontSize: 14,
  },
  signupLink: {
    color: "black",
    fontWeight: "bold",
  },
});
