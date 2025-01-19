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
import { supabase } from "../../services/supabaseClient"; // Import your Supabase client

export default function SignUpScreen({ }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      // Sign up the user with email and password
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Insert additional user details into the database
      const { data, error: dbError } = await supabase
        .from("users")
        .insert([
          {
            email,
          },
        ]);

      if (dbError) throw dbError;

      Alert.alert("Success", "Account created successfully!");
        router.push("/screens/loginScreen");
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

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

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Option */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Link href="/screens/loginScreen" style={styles.loginLink}>
        Login
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
  signUpButton: {
    width: "90%",
    backgroundColor: "#6D8299", // Soft gray button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  signUpButtonText: {
    color: "white", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 16,
    color: "#6D8299", // Soft gray text
    fontSize: 14,
  },
  loginLink: {
    color: "black", // Black for clickable text
    fontWeight: "bold",
  },
});
