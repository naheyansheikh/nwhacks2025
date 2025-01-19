import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        secureTextEntry={true}
        autoCapitalize="none"
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Signup Option */}
      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Text style={styles.signupLink}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0C4DE", // Dim pastel blue background
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black", // Black text for contrast
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6D8299", // Soft gray text
    marginBottom: 24,
  },
  input: {
    width: "90%",
    backgroundColor: "#D9E6F2", // Lighter pastel blue input field
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "black", // Black text for visibility
    fontSize: 16,
  },
  loginButton: {
    width: "90%",
    backgroundColor: "#6D8299", // Soft gray button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "white", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 16,
    color: "#6D8299", // Soft gray text
    fontSize: 14,
  },
  signupLink: {
    color: "black", // Black for clickable text
    fontWeight: "bold",
  },
});
