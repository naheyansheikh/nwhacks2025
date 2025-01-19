import React, { useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HouseFamFridgeScreen() {
  const [categoryExpanded, setCategoryExpanded] = useState({
    all: true,
    'expiring-soon': true,
    expired: true
  });

  const foodItems = {
    all: [
      { 
        name: "Lays Chips",
        expiration_date: "2025-03-15",
        daysUntil: 57
      },
      {
        name: "Eggs",
        expiration_date: "2024-02-15",
        daysUntil: 28
      },
      {
        name: "Yogurt",
        expiration_date: "2024-02-10",
        daysUntil: 23
      },
      {
        name: "Carrots",
        expiration_date: "2024-02-05",
        daysUntil: 18
      }
    ],
    'expiring-soon': [
      {
        name: "Bread",
        expiration_date: "2024-01-22",
        daysUntil: 4
      },
      {
        name: "Apples",
        expiration_date: "2024-01-25",
        daysUntil: 7
      },
      {
        name: "Bananas",
        expiration_date: "2024-01-21",
        daysUntil: 3
      },
      {
        name: "Cheese",
        expiration_date: "2024-01-20",
        daysUntil: 2
      }
    ],
    expired: [
      {
        name: "Milk",
        expiration_date: "2024-01-16",
        daysUntil: -2
      },
      {
        name: "Orange Juice",
        expiration_date: "2024-01-15",
        daysUntil: -3
      }
    ]
  };

  const getCategoryTitle = (category) => {
    switch(category) {
      case 'all':
        return 'Fresh Items';
      case 'expiring-soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'all':
        return '#4CAF50';
      case 'expiring-soon':
        return '#FFD93D';
      case 'expired':
        return '#FF6B6B';
      default:
        return 'black';
    }
  };

  const toggleCategory = (category) => {
    setCategoryExpanded({
      ...categoryExpanded,
      [category]: !categoryExpanded[category]
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}
          style={styles.touchableArea}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>House Fam Community Fridge</Text>
      </View>

      {/* Food Categories */}
      <ScrollView style={styles.scrollContainer}>
        {Object.keys(foodItems).map((category) => (
          <View key={category}>
            <TouchableOpacity 
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category)}
            >
              <Text style={[styles.categoryTitle, { color: getCategoryColor(category) }]}>
                {getCategoryTitle(category)} ({foodItems[category].length})
              </Text>
              <Ionicons 
                name={categoryExpanded[category] ? "chevron-down" : "chevron-forward"} 
                size={20} 
                color={getCategoryColor(category)} 
              />
            </TouchableOpacity>

            {categoryExpanded[category] && foodItems[category].map((item, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={[styles.expirationText, { color: getCategoryColor(category) }]}>
                    {category === 'expired' 
                      ? 'Expired'
                      : category === 'expiring-soon'
                      ? `Expires in ${item.daysUntil} days`
                      : `Fresh (${item.daysUntil} days left)`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B0C4DE",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#A2B9CE",
  },
  title: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
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
  touchableArea: {
    padding: 12,
  },
});