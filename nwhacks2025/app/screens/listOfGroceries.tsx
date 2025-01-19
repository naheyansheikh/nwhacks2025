import React, { useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Sample grocery data
const GROCERIES = [
  { name: "Eggs", expiration: "2025-01-15", status: "expired" },
  { name: "Milk", expiration: "2025-01-20", status: "expiring-soon" },
  { name: "Sweet Tea", expiration: "2025-03-01", status: "all" },
];

export default function GroceryListScreen() {
  const categorizeGroceries = (status: string) =>
    GROCERIES.filter((item) => item.status === status);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
  <TouchableOpacity onPress={() => router.back()} style={styles.link}>
    <Ionicons name="arrow-back-outline" size={24} color="black" />
  </TouchableOpacity>
  <Text style={styles.title}>Fridge</Text>
</View>

      {/* Expired Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expired</Text>
        {categorizeGroceries("expired").length > 0 ? (
          <FlatList
            data={categorizeGroceries("expired")}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.groceryItem}>
                <Text style={[styles.groceryText, styles.expiredText]}>
                  {item.name}
                </Text>
                <Text style={styles.expiredSubtext}>Expired!</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noItemsText}>No expired items</Text>
        )}
      </View>

      {/* Expiring Soon Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expiring Soon</Text>
        {categorizeGroceries("expiring-soon").length > 0 ? (
          <FlatList
            data={categorizeGroceries("expiring-soon")}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.groceryItem}>
                <Text style={styles.groceryText}>{item.name}</Text>
                <Text style={styles.expirationSubtext}>
                  Expires in{" "}
                  {Math.ceil(
                    (new Date(item.expiration).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noItemsText}>No items expiring soon</Text>
        )}
      </View>

      {/* All Items Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Items</Text>
        {GROCERIES.length > 0 ? (
          <FlatList
            data={GROCERIES}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.groceryItem}>
                <Text style={styles.groceryText}>{item.name}</Text>
                <Text style={styles.expirationSubtext}>
                  {new Date(item.expiration).toLocaleDateString()}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noItemsText}>No items available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B0C4DE", // Dim pastel blue background
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#A2B9CE",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  groceryItem: {
    backgroundColor: "#D9E6F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  groceryText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  expiredText: {
    color: "red", // Red text for expired items
  },
  expirationSubtext: {
    fontSize: 12,
    color: "#6D8299", // Soft gray text
    marginTop: 4,
  },
  expiredSubtext: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
  noItemsText: {
    fontSize: 14,
    color: "#6D8299",
    textAlign: "center",
  },
  link: {
    paddingHorizontal: 8,
  },
});
