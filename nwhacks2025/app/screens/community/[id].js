import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../services/supabaseClient";

export default function CommunityDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Community ID from params
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [soonToExpireFoods, setSoonToExpireFoods] = useState({}); // Foods grouped by user_id

  useEffect(() => {
    const fetchCommunityAndMembers = async () => {
      try {
        if (id) {
          const { data: communityData, error: communityError } = await supabase
            .from("communities")
            .select("*")
            .eq("id", Number(id))
            .single();

          if (communityError) {
            setError("Community not found.");
            setLoading(false);
            return;
          }

          setCommunity(communityData);

          const { data: membersData, error: membersError } = await supabase
            .from("community_members")
            .select("user_id")
            .eq("community_id", Number(id));

          if (membersError) {
            setError("Error fetching members.");
          } else {
            setMembers(membersData);
            await fetchSoonToExpireFoods(membersData);
          }
        }
      } catch (e) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSoonToExpireFoods = async (membersData) => {
      const groceriesByMember = {};

      for (const member of membersData) {
        const { data: groceries, error: groceriesError } = await supabase
          .from("groceries")
          .select("*")
          .eq("user_id", member.user_id);

        if (groceriesError) {
          groceriesByMember[member.user_id] = [];
        } else {
          const soonExpiringGroceries = groceries.filter((grocery) => {
            const expirationDate = new Date(grocery.expiration_date);
            const now = new Date();
            const daysUntilExpiration =
              (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return daysUntilExpiration >= 0 && daysUntilExpiration <= 7;
          });

          groceriesByMember[member.user_id] = soonExpiringGroceries;
        }
      }

      setSoonToExpireFoods(groceriesByMember);
    };

    fetchCommunityAndMembers();
  }, [id]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>{community?.name}</Text>
        <Text style={styles.info}>Code: {community?.code}</Text>
        {/* <Text style={styles.info}>
          Created At: {new Date(community?.created_at).toLocaleString()}
        </Text> */}

        <Text style={styles.subtitle}>Community Members</Text>
        {members.length > 0 ? (
          members.map((member) => (
            <View key={member.user_id} style={styles.memberSection}>
              <Text style={styles.memberHeader}>Member ID: {member.user_id}</Text>
              {soonToExpireFoods[member.user_id] &&
              soonToExpireFoods[member.user_id].length > 0 ? (
                soonToExpireFoods[member.user_id].map((food) => (
                  <View key={food.id} style={styles.foodItem}>
                    <Text style={styles.foodName}>Food: {food.name}</Text>
                    <Text style={styles.foodExpiration}>
                      Expiration Date:{" "}
                      {new Date(food.expiration_date).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noFoodsText}>No soon-to-expire foods.</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noMembersText}>
            No members in this community yet.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#B0C4DE", // Match the pastel blue theme
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    color: "#6D8299", // Subtle gray text
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B5563", // Dark gray for section headers
    marginBottom: 16,
    textAlign: "center",
  },
  memberSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#D9E6F2", // Light pastel blue for member sections
    borderRadius: 8,
  },
  memberHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 8,
  },
  foodItem: {
    padding: 12,
    backgroundColor: "#E8F0F8", // Lighter blue for food items
    borderRadius: 8,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  foodExpiration: {
    fontSize: 14,
    color: "#4B5563",
  },
  noFoodsText: {
    fontSize: 14,
    color: "#6D8299",
  },
  noMembersText: {
    fontSize: 16,
    color: "#6D8299",
    textAlign: "center",
  },
});
