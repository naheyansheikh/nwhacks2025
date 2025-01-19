import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { supabase } from "../../services/supabaseClient"; // Adjust the import based on your project structure

export default function CommunitiesScreen() {
    const [joinCode, setJoinCode] = useState("");
    const [createCode, setCreateCode] = useState("");
    const [communityName, setCommunityName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [existingCommunity, setExistingCommunity] = useState(null);
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        const fetchExistingCommunity = async () => {
            if (joinCode) {
                const { data, error } = await supabase
                    .from("communities")
                    .select("*")
                    .eq("code", joinCode)
                    .single();

                if (error && error.code !== "PGRST116") {
                    console.error("Error fetching community:", error);
                } else {
                    setExistingCommunity(data);
                }
            }
        };

        fetchExistingCommunity();
    }, [joinCode]);

    const handleJoinCommunity = async () => {
        setMessage(''); // Reset message
        if (!joinCode) {
            setMessage('Please enter a join code to join a community.');
            return;
        }

        setLoading(true); // Set loading state

        // Check if the community code already exists
        const { data: existingCommunity, error: fetchError } = await supabase
            .from('communities')
            .select('*')
            .eq('code', joinCode)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Handle specific error for no rows found
            console.error('Error fetching community:', fetchError);
            setMessage('Error checking community code.');
            setLoading(false);
            return;
        }

        if (existingCommunity) {
            // Check if the user is already a member of the community
            const { data: { user } } = await supabase.auth.getUser(); // Correctly retrieve the user
            const { data: existingMembership, error: membershipError } = await supabase
                .from('community_members')
                .select('*')
                .eq('user_id', user?.id)
                .eq('community_id', existingCommunity.id);

            if (membershipError) {
                console.error('Error checking membership:', membershipError);
                setMessage('Error checking membership.');
                setLoading(false);
                return;
            }

            // Check if the user is already a member
            if (existingMembership.length > 0) {
                // Redirect to the community page if already a member
                setMessage('You are already a member of this community. Redirecting...');
                router.push(`/screens/community/${existingCommunity.id}`); // Redirect to the community page
            } else {
                // If the user is not a member, insert a new membership record
                const { error: joinError } = await supabase
                    .from('community_members')
                    .insert([{ user_id: user?.id, community_id: existingCommunity.id }]);

                if (joinError) {
                    console.error('Error joining community:', joinError);
                    setMessage('Error joining community.');
                } else {
                    setMessage('Successfully joined the community!');
                    // Redirect to the community page
                    router.push(`/screens/community/${existingCommunity.id}`);
                }
            }
        } else {
            setMessage('Community not found. Please check the code.');
        }

        setLoading(false); // Reset loading state
    };

    const handleCreateCommunity = async () => {
        setMessage(''); // Reset message
        if (!createCode || !communityName) {
            setMessage('Please enter a code and a name for the new community.');
            return;
        }

        setLoading(true); // Set loading state

        // Check if the community code already exists
        const { data: existingCommunity, error: fetchError } = await supabase
            .from('communities')
            .select('*')
            .eq('code', createCode)
            .single();

        if (existingCommunity) {
            setMessage('Community with this code already exists. Please choose a different code.');
            setLoading(false);
            return;
        }

        // If the community does not exist, create a new one
        const { error: createError } = await supabase
            .from('communities')
            .insert([{ code: createCode, name: communityName }]); // Do not include user_id here

        if (createError) {
            console.error('Error creating community:', createError);
            setMessage('Error creating community: ' + createError.message);
            setLoading(false);
            return;
        }

        setMessage('New community created successfully! You can now join.');

        // Fetch the newly created community ID
        const { data: newCommunity } = await supabase
            .from('communities')
            .select('*')
            .eq('code', createCode)
            .single();

        // Automatically add the user as a member of the new community
        const { data: { user } } = await supabase.auth.getUser(); // Correctly retrieve the user
        const { error: joinError } = await supabase
            .from('community_members')
            .insert([{ user_id: user?.id, community_id: newCommunity.id }]); // Insert the user as a member

        if (joinError) {
            console.error('Error adding user to community:', joinError);
            setMessage('Error adding you to the community.');
        } else {
            // Redirect to the newly created community page
            router.push(`/screens/community/${newCommunity.id}`); // Adjust the route as needed
        }

        setCreateCode(''); // Clear the input field
        setCommunityName(''); // Clear the input field

        setLoading(false); // Reset loading state
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity
                    onPress={() => {
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
                <Text style={styles.title}>Communities</Text>
                <View style={{ flex: 1 }} />
            </View>

            <View style={styles.joinCodeContainer}>
                <Ionicons name="people-outline" size={48} color="#6D8299" style={styles.communityIcon} />
                <Text style={styles.subtitle}>Join a Community</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Join Code"
                    placeholderTextColor="#6D8299"
                    value={joinCode}
                    onChangeText={(text) => {
                        setJoinCode(text);
                        setExistingCommunity(null); // Reset community when joinCode changes
                    }}
                />
                <TouchableOpacity style={styles.joinButton} onPress={handleJoinCommunity} disabled={loading}>
                    <Text style={styles.joinButtonText}>{loading ? "Joining..." : "Join"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.createCommunityContainer}>
                <Text style={styles.subtitle}>Create a New Community</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter New Community Code"
                    placeholderTextColor="#6D8299"
                    value={createCode}
                    onChangeText={setCreateCode}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Community Name"
                    placeholderTextColor="#6D8299"
                    value={communityName}
                    onChangeText={setCommunityName}
                />
                <TouchableOpacity style={styles.joinButton} onPress={handleCreateCommunity} disabled={loading}>
                    <Text style={styles.joinButtonText}>{loading ? "Creating..." : "Create Community"}</Text>
                </TouchableOpacity>
            </View>

            {message && <Text style={styles.message}>{message}</Text>}
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
        textAlign: "center",
        flex: 1,
    },
    joinCodeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    communityIcon: {
        marginBottom: 16,
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
    touchableArea: {
        padding: 12,
    },
    message: {
        color: "red",
        marginTop: 16,
        textAlign: "center",
    },
    createCommunityContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
});
