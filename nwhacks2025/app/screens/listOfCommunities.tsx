import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [friendsExpanded, setFriendsExpanded] = useState(false);
  const [communitiesExpanded, setCommunitiesExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>People in your community</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a community or friend"
        placeholderTextColor="#B4B8D4"
      />

      {/* Friends Section */}
      <View>
        <TouchableOpacity 
          style={styles.section}
          onPress={() => setFriendsExpanded(!friendsExpanded)}
        >
          <Text style={styles.sectionTitle}>Friends</Text>
          <Ionicons 
            name={friendsExpanded ? "chevron-down" : "chevron-forward"} 
            size={20} 
            color="black" 
          />
        </TouchableOpacity>
        
        {friendsExpanded && (
          <View style={styles.dropdownItem}>
            <View style={styles.profileIcon}>
              <Ionicons name="person-outline" size={20} color="black" />
            </View>
            <Text style={styles.dropdownText}>Joe</Text>
          </View>
          
          
        )}
      </View>

      {/* Communities Section */}
      <View>
        <TouchableOpacity 
          style={styles.section}
          onPress={() => setCommunitiesExpanded(!communitiesExpanded)}
        >
          <Text style={styles.sectionTitle}>Communities</Text>
          <Ionicons 
            name={communitiesExpanded ? "chevron-down" : "chevron-forward"} 
            size={20} 
            color="black" 
          />
        </TouchableOpacity>
        
        {communitiesExpanded && (
          <View style={styles.dropdownItem}>
            <View style={styles.profileIcon}>
              <Ionicons name="people-outline" size={20} color="black" />
            </View>
            <Text style={styles.dropdownText}>University Friends</Text>
          </View>
        )}
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
    backgroundColor: "#B0C4DE",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#A2B9CE",
  },
  title: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "#D9E6F2",
    margin: 16,
    padding: 10,
    borderRadius: 8,
    color: "#6D8299",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#A2B9CE",
  },
  sectionTitle: {
    color: "black",
    fontSize: 16,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 8,
    backgroundColor: "#C9D6E5",
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D9E6F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dropdownText: {
    color: "black",
    fontSize: 14,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#B0C4DE",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#A2B9CE",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "black",
    fontSize: 12,
    marginTop: 4,
  },
});