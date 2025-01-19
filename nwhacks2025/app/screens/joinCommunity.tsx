import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

export default function CommunitiesScreen() {
    const [joinCode, setJoinCode] = useState<string>("");

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

                {/* Empty View for Centering */}
                <Text style={styles.title}>Communities</Text>

                {/* Empty View for Alignment */}
                <View style={{ flex: 1 }} />
            </View>

            {/* Join Code Bar */}
            <View style={styles.joinCodeContainer}>
                {/* Community Icon */}
                <Ionicons name="people-outline" size={48} color="#6D8299" style={styles.communityIcon} />

                <Text style={styles.subtitle}>Join a Community</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Join Code"
                    placeholderTextColor="#6D8299"
                    value={joinCode}
                    onChangeText={(text) => setJoinCode(text)}
                />
                <Link href="/screens/joinButton" asChild>
                    <TouchableOpacity style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                </Link>
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
        justifyContent: "space-between", // Distributes items evenly
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
        flex: 1, // Ensures the title is centered
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
        padding: 12, // Larger touchable area
    },
});
