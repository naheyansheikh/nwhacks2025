import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { supabase } from "../../services/supabaseClient";
import axios from 'axios';
import Config from 'react-native-config';

type GroceryItem = {
  id: number;
  name: string;
  expiration_date: string;
  status: string;
};

const GEMINI_API_KEY = "CHANGE THIS"

export default function GroceryListScreen() {
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [recipe, setRecipe] = useState('');

  const generateRecipe = async () => {
    const prompt = `Create a recipe using the following ingredients: ${groceries.map((a) => a.name).join(', ')} only list ingredients and steps and keep in concise`;
    try {
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const recipe = response.data["candidates"][0]["content"]["parts"][0]["text"];
      setRecipe(recipe); // Set the generated recipe
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      const { data, error } = await supabase
        .from('groceries')
        .select('*')
        .order('expiration_date', { ascending: true });
      if (error) throw error;
      setGroceries(data || []);
    } catch (error) {
      console.error('Error fetching groceries:', error);
    }
  };

  const categorizeGroceries = (status: string) =>
    groceries.filter((item) => item.status === status);

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
            keyExtractor={(item) => item.id.toString()}
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.groceryItem}>
                <Text style={styles.groceryText}>{item.name}</Text>
                <Text style={styles.expirationSubtext}>
                  Expires in{" "}
                  {Math.ceil(
                    (new Date(item.expiration_date).getTime() -
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
        {groceries.length > 0 ? (
          <FlatList
            data={groceries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.groceryItem}>
                <Text style={styles.groceryText}>{item.name}</Text>
                <Text style={styles.expirationSubtext}>
                  {new Date(item.expiration_date).toLocaleDateString()}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noItemsText}>No items available</Text>
        )}
      </View>

      {/* Add Food Entry Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push("/screens/foodEntry")}
      >
        <Text style={styles.addButtonText}>Add Food Entry</Text>
      </TouchableOpacity>

      <Button title="Generate Recipe" onPress={generateRecipe} />
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Generated Recipe:</Text>
      <Text style={{ marginTop: 10 }}>{recipe}</Text>
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
  addButton: {
    backgroundColor: '#6D8299',
    padding: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
