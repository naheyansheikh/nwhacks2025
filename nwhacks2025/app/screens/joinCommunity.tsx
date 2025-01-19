import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CommunitiesScreen() {
  const [joinCode, setJoinCode] = useState<string>("");

  return (
    <View style={styles.container}>
      {/* Join Code Bar */}
      <View style={styles.joinCodeContainer}>
        {/* Community Icon */}
        <Ionicons name="people-circle-outline" size={80} color="#6D8299" />
        <Text style={styles.subtitle}>Join a Community</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Join Code"
          placeholderTextColor="#6D8299"
          value={joinCode}
          onChangeText={(text) => setJoinCode(text)}
        />
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
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
  joinCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6D8299",
    marginBottom: 16,
  },
  input: {
    width: "90%",
    backgroundColor: "#D9E6F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "black",
    fontSize: 16,
  },
  joinButton: {
    width: "90%",
    backgroundColor: "#6D8299",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
