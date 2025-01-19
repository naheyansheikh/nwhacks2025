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
  const [error, setError] = useState('');
  const [soonToExpireFoods, setSoonToExpireFoods] = useState({}); // Foods grouped by user_id

  useEffect(() => {
    const fetchCommunityAndMembers = async () => {
      try {
        if (id) {
          // Fetch the community details
          const { data: communityData, error: communityError } = await supabase
            .from('communities')
            .select('*')
            .eq('id', Number(id)) // Convert id to a number if the column is integer-based
            .single();

          if (communityError) {
            console.error('Error fetching community:', communityError);
            setError('Community not found.');
            setLoading(false);
            return;
          }

          setCommunity(communityData);

          // Fetch all members of the community
          const { data: membersData, error: membersError } = await supabase
            .from('community_members')
            .select('user_id')
            .eq('community_id', Number(id));

          if (membersError) {
            console.error('Error fetching members:', membersError);
            setError('Error fetching members.');
          } else {
            setMembers(membersData);

            // Fetch soon-to-expire foods for each member
            await fetchSoonToExpireFoods(membersData);
          }
        }
      } catch (e) {
        console.error('Unexpected error:', e);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSoonToExpireFoods = async (membersData) => {
      const groceriesByMember = {};

      for (const member of membersData) {
        // Fetch groceries for the user
        const { data: groceries, error: groceriesError } = await supabase
          .from('groceries')
          .select('*')
          .eq('user_id', member.user_id);

        if (groceriesError) {
          console.error(`Error fetching groceries for user ${member.user_id}:`, groceriesError);
          groceriesByMember[member.user_id] = [];
        } else {
          // Filter for soon-to-expire groceries (e.g., expiring within the next 7 days)
          const soonExpiringGroceries = groceries.filter((grocery) => {
            const expirationDate = new Date(grocery.expiration_date);
            const now = new Date();
            const daysUntilExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return daysUntilExpiration >= 0 && daysUntilExpiration <= 7; // Change the range as needed
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
        <Text>Code: {community?.code}</Text>
        <Text>Created At: {new Date(community?.created_at).toLocaleString()}</Text>

        <Text style={styles.subtitle}>Community Members</Text>
        {members.length > 0 ? (
          members.map((member) => (
            <View key={member.user_id} style={styles.memberSection}>
              <Text style={styles.memberHeader}>Member ID: {member.user_id}</Text>
              {soonToExpireFoods[member.user_id] && soonToExpireFoods[member.user_id].length > 0 ? (
                soonToExpireFoods[member.user_id].map((food) => (
                  <View key={food.id} style={styles.foodItem}>
                    <Text style={styles.foodName}>Food: {food.name}</Text>
                    <Text style={styles.foodExpiration}>
                      Expiration Date: {new Date(food.expiration_date).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No soon-to-expire foods.</Text>
              )}
            </View>
          ))
        ) : (
          <Text>No members in this community yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  memberSection: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  memberHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  foodItem: {
    padding: 8,
    backgroundColor: "#D1D5DB",
    borderRadius: 8,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foodExpiration: {
    fontSize: 14,
    color: "#4B5563",
  },
});
