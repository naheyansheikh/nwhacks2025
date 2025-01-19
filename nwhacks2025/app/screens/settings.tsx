import React from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Keeps back button aligned to the left
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#A2B9CE", // Slightly darker pastel blue divider
    position: "relative", // Enables absolute positioning for the title
  },
  title: {
    fontSize: 18,
    color: "black", // Black text for contrast
    fontWeight: "bold",
    position: "absolute", // Centers the title
    left: 0,
    right: 0,
    textAlign: "center",
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
  profileButton: {
    width: "90%",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#6D8299", // Border color for the empty avatar circle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
});
