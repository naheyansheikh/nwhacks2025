import React from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* Options Container */}
      <View style={styles.optionsContainer}>
        <Text style={styles.subtitle}>Manage your account settings</Text>

        {/* Profile Section */}
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#6D8299" />
          </View>
          <Text style={styles.optionButtonText}>Set Profile</Text>
        </TouchableOpacity>

        {/* Reset Password Section */}
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionButtonText}>Reset Password</Text>
        </TouchableOpacity>

        {/* FAQ Section */}
        <Link href="/screens/faq" asChild>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionButtonText}>FAQ</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B0C4DE", // Dim pastel blue background
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6D8299", // Soft gray text
    marginBottom: 16,
    textAlign: "center",
  },
  profileButton: {
    alignItems: "center", // Centers the profile content
    marginBottom: 16,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center", // Ensures the icon is perfectly centered
    marginBottom: 8,
  },
  optionButton: {
    width: "90%",
    backgroundColor: "#6D8299", // Soft gray button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  optionButtonText: {
    color: "white", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
});
