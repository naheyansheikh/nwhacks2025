import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Login", // Custom header for login screen
        }}
      />
      <Stack.Screen
        name="screens/spacesScreen"
        options={{
          headerTitle: "Spaces", // Custom header for spaces
        }}
      />
      <Stack.Screen
        name="screens/signupScreen"
        options={{
          headerTitle: "Sign Up", // Custom header for sign up
        }}
      />
      <Stack.Screen
        name="screens/settings"
        options={{
          headerTitle: "Settings", // Custom header for settings screen
        }}
      />
      <Stack.Screen
        name="screens/joinCommunity"
        options={{
          headerTitle: "Join Community", // Custom header for joining communities screen
        }}
      />
      <Stack.Screen
        name="screens/listOfCommunities"
        options={{
          headerTitle: "Your Communities", // Your communities
        }}
      />
      <Stack.Screen
        name="screens/recipeGeneration"
        options={{
          headerTitle: "Generate Recipes", // Your communities
        }}
      />
      <Stack.Screen
        name="screens/listOfGroceries"
        options={{
          headerTitle: "Food Items", // Your communities
        }}
      />
      <Stack.Screen
        name="screens/foodEntry"
        options={{
          headerTitle: "Input Food Items", // Your communities
        }}
      />
    </Stack>

  );
}
