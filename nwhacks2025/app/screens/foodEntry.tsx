import React, { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../services/supabaseClient";

export default function AddFoodItemScreen() {
  const [foodName, setFoodName] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || "");
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('groceries')
        .insert([
          { 
            name: foodName, 
            expiration_date: expirationDate,
            status: calculateStatus(expirationDate),
            user_id: userId
          }
        ]);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      Alert.alert("Success", "Food item added successfully!");
      router.back();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert("Error", error.message);
    }
  };

  const calculateStatus = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) return "expired";
    if (daysUntilExpiration <= 7) return "expiring-soon";
    return "all";
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
      <TouchableOpacity
          onPress={() => {
            console.log("Back button pressed");
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/screens/spacesScreen");
            }
          }}
          style={styles.touchableArea}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Food Item</Text>
      </View>

      {/* Food Input Container */}
      <View style={styles.inputContainer}>
        <Text style={styles.subtitle}>Enter Food Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Food Name"
          placeholderTextColor="#6D8299"
          value={foodName}
          onChangeText={(text) => setFoodName(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Expiration Date (e.g., YYYY-MM-DD)"
          placeholderTextColor="#6D8299"
          value={expirationDate}
          onChangeText={(text) => setExpirationDate(text)}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
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
    flex: 1, // Flex alignment for centering
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6D8299", // Soft gray text
    marginBottom: 16,
  },
  input: {
    width: "90%",
    backgroundColor: "#D9E6F2", // Lighter pastel blue for input field
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "black", // Black text for visibility
    fontSize: 16,
  },
  saveButton: {
    width: "90%",
    backgroundColor: "#6D8299", // Soft gray button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  touchableArea: {
    padding: 12, // Larger touchable area
  },
});
