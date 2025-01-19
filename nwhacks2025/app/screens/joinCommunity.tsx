import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Define the types for navigation props
type RootStackParamList = {
  Communities: undefined;
  Login: undefined;
  Spaces: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Communities">;

export default function CommunitiesScreen({ navigation }: Props) {
  const [joinCode, setJoinCode] = useState<string>("");

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Communities</Text>
      </View>

      {/* Join Code Bar */}
      <View style={styles.joinCodeContainer}>
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
  joinCodeContainer: {
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
  joinButton: {
    width: "90%",
    backgroundColor: "#6D8299", // Soft gray button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "white", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
});
