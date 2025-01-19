import React, { useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Install expo-icons if not already installed
import { useRouter } from "expo-router"; // For navigation
import * as Notifications from "expo-notifications";
import { supabase } from "../../services/supabaseClient";
import { Link, router } from "expo-router";

const fetchFoodItemsFromDatabase = async () => {
  const { data, error } = await supabase
    .from("groceries")
    .select("name, expiration_date");

  if (error) {
    console.error("Error fetching food items:", error);
    return [];
  }

  console.log("Fetched food items:", data); // Log for debugging
  return data.map((item) => ({
    name: item.name,
    expirationDate: new Date(item.expiration_date),
  }));
};

export default function Index() {
  const router = useRouter(); // Router hook for navigation

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          alert("You need to enable notifications to receive alerts about food expiration.");
        }
      }
    };

    const scheduleNotification = async (item, message) => {
      console.log(`Scheduling notification for: ${item.name}`);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Food Expiration Alert",
          body: message,
        },
        trigger: { seconds: 5, repeats: false },
      });
    };

    const checkExpiredFoods = async () => {
      const foodItems = await fetchFoodItemsFromDatabase();
      console.log("Checking expired foods...");

      foodItems.forEach(async (item) => {
        if (item.expirationDate < new Date()) {
          await scheduleNotification(item, `${item.name} has expired!`);
        } else if (
          item.expirationDate <= new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
        ) {
          await scheduleNotification(item, `${item.name} will expire soon!`);
        }
      });
    };

    // Handle notifications received while the app is in the foreground
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
      alert(notification.request.content.body); // Show an alert for debugging
    });

    // Run notification setup when the screen loads
    requestPermissions();
    checkExpiredFoods();

    // Clean up the listener on component unmount
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <Link href="/screens/enterNewItemOptions" asChild>
      <View style={styles.topBar}>
        <Text style={styles.title}>Spaces</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>
      </Link>

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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="basket-outline" size={24} color="black" />
          <Text style={styles.navText}>Spaces</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/screens/recipeGeneration")}>
          <Ionicons name="restaurant-outline" size={24} color="black" />
          <Text style={styles.navText}>Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/screens/joinCommunity")}
        >
          <Ionicons name="people-outline" size={24} color="black" />
          <Text style={styles.navText}>Communities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/screens/settings")}>
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
    alignItems: "center",
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
