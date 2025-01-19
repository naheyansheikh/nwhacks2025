import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FAQScreen() {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      {/* <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>FAQ</Text>
      </View> */}

      {/* FAQ Container */}
      <View style={styles.faqContainer}>
        <Text style={styles.subtitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.question}>1. How do I add an item to the fridge?</Text>
          <Text style={styles.answer}>Simply click the 'Add Item' button and fill in the details including the food name, expiration date, and any other relevant information.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>2. How will I know if an item is about to expire?</Text>
          <Text style={styles.answer}>The app will send you a reminder notification a few days before the expiration date to let you know which items need to be used or donated soon.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>3. Can I remove an item once it's been added?</Text>
          <Text style={styles.answer}>Yes, you can easily remove any item from the list by selecting the item and clicking the 'Remove' button.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>4. How can I report expired items?</Text>
          <Text style={styles.answer}>Expired items will be automatically marked as expired, but you can manually report any item by clicking on the item and selecting 'Report Expired.'</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>5. What happens if multiple people add the same item?</Text>
          <Text style={styles.answer}>The app will keep track of multiple entries and allow users to update or remove duplicate items if necessary. This helps to prevent waste.</Text>
        </View>
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
  faqContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#6D8299", // Soft gray text
    marginBottom: 16,
    textAlign: "center",
  },
  faqItem: {
    backgroundColor: "#F4F6F9", // Light gray background for FAQ items
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    color: "#6D8299", // Soft gray text for the questions
    fontWeight: "bold",
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: "#4F5B66", // Darker gray text for the answers
  },
});
