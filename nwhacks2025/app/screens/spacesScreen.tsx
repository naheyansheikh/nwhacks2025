import React from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Install expo-icons if not already installed
import { useRouter } from "expo-router"; // For navigation
import { Link } from "expo-router";

export default function Index() {
  const router = useRouter(); // Router hook for navigation

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Spaces</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search All Items"
        placeholderTextColor="#B4B8D4"
      />

      {/* Fridge Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fridge</Text>
          <Link href="/screens/listOfGroceries" style={styles.link}>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </Link>
        </View>

        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join Community</Text>
          <Link href="/screens/joinCommunity" style={styles.link}>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </Link>
        </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="basket-outline" size={24} color="black" />
          <Text style={styles.navText}>Spaces</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="restaurant-outline" size={24} color="black" />
          <Text style={styles.navText}>Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people-outline" size={24} color="black" />
          <Text style={styles.navText}>Communities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#A2B9CE", // Slightly darker pastel blue divider
  },
  title: {
    fontSize: 18,
    color: "black", // Black text for contrast
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "#D9E6F2", // Lighter pastel blue for input field
    margin: 16,
    padding: 10,
    borderRadius: 8,
    color: "#6D8299", // Soft gray for input text
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#A2B9CE", // Slightly darker pastel blue
  },
  sectionTitle: {
    color: "black", // Black for visibility
    fontSize: 16,
  },
  bottomNav: {
    position: "absolute", // Position it at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#B0C4DE", // Match the main dim pastel blue background
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#A2B9CE", // Slightly darker divider
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "black", // Black text for buttons
    fontSize: 12,
    marginTop: 4,
  },
  link: {
    paddingHorizontal: 8,
  },
});
