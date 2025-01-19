import React, { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../services/supabaseClient";

export default function HouseFamFridgeScreen() {
  const [categoryExpanded, setCategoryExpanded] = useState({
    all: true,
    'expiring-soon': true,
    expired: true,
  });
  const [groceries, setGroceries] = useState([]);

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      const userResponse = await supabase.auth.getUser();
      console.log("User Response:", userResponse);
      const userId = userResponse.data?.user?.id;

      if (!userId) {
        console.error("User ID is undefined. User may not be logged in.");
        return;
      }

      const { data, error } = await supabase
        .from("groceries")
        .select("*")
        .eq("user_id", userId)
        .order("expiration_date", { ascending: true });

      if (error) {
        console.error("Error fetching groceries:", error);
        throw error;
      }

      setGroceries(data || []);
    } catch (error) {
      console.error("Error fetching groceries:", error);
    }
  };

  const categorizeGroceries = () => {
    const now = new Date();
    return groceries.reduce(
      (categories, item) => {
        const daysUntil =
          Math.ceil(
            (new Date(item.expiration_date).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          );
        if (daysUntil < 0) {
          categories.expired.push({ ...item, daysUntil });
        } else if (daysUntil <= 7) {
          categories["expiring-soon"].push({ ...item, daysUntil });
        } else {
          categories.all.push({ ...item, daysUntil });
        }
        return categories;
      },
      { all: [], "expiring-soon": [], expired: [] }
    );
  };

  const toggleCategory = (category) => {
    setCategoryExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case "all":
        return "Fresh Items";
      case "expiring-soon":
        return "Expiring Soon";
      case "expired":
        return "Expired";
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "all":
        return "#4CAF50";
      case "expiring-soon":
        return "#D6B222";
      case "expired":
        return "#FF6B6B";
      default:
        return "black";
    }
  };

  const categorizedGroceries = categorizeGroceries();

  return (
    <View style={styles.container}>
      {/* Food Categories */}
      <ScrollView style={styles.scrollContainer}>
        {Object.keys(categorizedGroceries).map((category) => (
          <View key={category}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category)}
            >
              <Text
                style={[
                  styles.categoryTitle,
                  { color: getCategoryColor(category) },
                ]}
              >
                {getCategoryTitle(category)} (
                {categorizedGroceries[category].length})
              </Text>
              <Ionicons
                name={
                  categoryExpanded[category]
                    ? "chevron-down"
                    : "chevron-forward"
                }
                size={20}
                color={getCategoryColor(category)}
              />
            </TouchableOpacity>

            {categoryExpanded[category] &&
              categorizedGroceries[category].map((item) => (
                <View key={item.id} style={styles.foodItem}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text
                      style={[
                        styles.expirationText,
                        { color: getCategoryColor(category) },
                      ]}
                    >
                      {category === "expired"
                        ? "Expired!"
                        : category === "expiring-soon"
                        ? `Expires in ${item.daysUntil} days`
                        : `Fresh (${item.daysUntil} days left)`}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/screens/foodEntry")}
        >
          <Text style={styles.addButtonText}>Add Food Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.receiptButton}
          onPress={() => router.push("/screens/foodReceiptScan")}
        >
          <Text style={styles.addButtonText}>Scan Receipt</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="basket-outline" size={24} color="black" />
          <Text style={styles.navText}>Items</Text>
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
    backgroundColor: "#B0C4DE",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#D9E6F2",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foodItem: {
    backgroundColor: "#E8F0F8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#D9E6F2",
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    color: "black",
    marginBottom: 4,
  },
  expirationText: {
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    position: "absolute",
    bottom: 70, // Above the bottom navigation
    width: "100%",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#6D8299",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  receiptButton: {
    flex: 1,
    backgroundColor: "#6D8299",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#D9E6F2",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#A2B9CE",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "black",
    marginTop: 4,
  },
});
